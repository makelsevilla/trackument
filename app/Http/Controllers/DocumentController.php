<?php

namespace App\Http\Controllers;

use App\Http\Requests\FinalizeDocumentRequest;
use App\Http\Requests\StoreDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Document/UserDraftDocuments");
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        $document = Document::make([
            "owner_id" => $user->id,
            "current_owner_id" => $user->id,
        ]);
        if (!$document->save()) {
            return back()->with([
                "message" => "An error occured while creating a document.",
            ]);
        }

        return to_route("documents.edit", ["document" => $document->id]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Document $document)
    {
        $user = auth()->user();

        // can only be viewed if is_draft is false
        if ($document->is_draft) {
            abort(403, "This document is not yet available for viewing.");
        }

        // if the user is the current_owner and the author, display action button and document histories
        // if the user is only the current owner, display the details and action button
        // if the user is neither, display the overview

        /*        $withActionButtons = $document->current_owner_id === $user->id;
         $withDocumentHistories = $document->owner_id === $user->id;*/

        // sa front-end ko nalang gawin yung logic
        $is_current_owner = $document->current_owner_id === $user->id;
        $is_owner = $document->owner_id === $user->id;

        // Getting the document type name and description
        $document_type = DB::table("document_types")
            ->where("id", $document->document_type_id)
            ->select("name", "description")
            ->first();
        $document["document_type"] = $document_type;

        // getting the owner and current owner
        $document["current_owner"] = $document
            ->getOwner("current")
            ->select("name")
            ->first();
        $document["owner"] = $document
            ->getOwner("owner")
            ->select("name")
            ->first();

        // getting the related documents code
        $document["related_documents"] = DB::table("related_documents")
            ->where("document_id", "=", $document->id)
            ->get();

        return Inertia::render("Document/ViewDocument", [
            "document" => $document,
            "isCurrentOwner" => $is_current_owner,
            "isOwner" => $is_owner,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Document $document)
    {
        $user = auth()->user();
        if ($user->id !== $document->owner_id || !$document["is_draft"]) {
            abort(403, "Unauthorized action.");
        }

        $document_types = DB::table("document_types")
            ->select("id", "name", "description")
            ->get();
        $document_purposes = DB::table("document_purposes")->get();

        $related_documents = DB::table("related_documents")
            ->where("document_id", $document->id)
            ->select("related_document_code")
            ->get()
            ->toArray();
        $related_documents = array_column(
            $related_documents,
            "related_document_code"
        );

        return Inertia::render("Document/EditDraft", [
            "document" => array_merge($document->toArray(), [
                "related_documents" => $related_documents,
            ]),
            "documentTypes" => $document_types,
            "documentPurposes" => $document_purposes,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDocumentRequest $request, Document $document)
    {
        $validated = $request->validated();
        $validated["title"] = ucwords(strtolower($validated["title"]));
        $document->update($validated);

        // handling related documents
        if (isset($validated["related_documents"])) {
            $document->saveRelatedDocuments(
                $document->id,
                $validated["related_documents"]
            );
        }

        return back()->with([
            "message" => "Document saved successfully.",
            "status" => "success",
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        $user = auth()->user();
        if (
            $document->owner_id !== $user->id &&
            $document->current_owner_id !== $user->id &&
            $document->status === "terminal"
        ) {
            abort(
                403,
                "Unauthorized action. You can only delete the document if you are the owner, you currently own the document, and the document is not tagged as terminal."
            );
        }

        if ($document["is_draft"]) {
            // delete document and its files permanently
            $document->deleteFiles();
            $document->deleteRelatedDocuments();
            $document->forceDelete();

            return back()->with([
                "message" => "Document deleted successfully.",
                "status" => "success",
            ]);
        } else {
            // the document is not a draft, so we soft delete it
            if ($document->delete()) {
                return back()->with([
                    "message" => "Document deleted successfully.",
                    "status" => "success",
                ]);
            }
        }

        // if no successfull deletion, return error
        return back()->with([
            "message" => "An error occured while deleting the document.",
            "status" => "error",
        ]);
    }

    public function finalize(
        FinalizeDocumentRequest $request,
        Document $document
    ) {
        $validated = $request->validated();

        // handling related documents
        if (isset($validated["related_documents"])) {
            $document->saveRelatedDocuments(
                $document->id,
                $validated["related_documents"]
            );
        }

        // fill the document with validated data
        $document->fill($validated);

        // generate tracking code
        $document_type = DB::table("document_types")
            ->where("id", $document->document_type_id)
            ->select("abbreviation")
            ->first();
        $document->tracking_code = $document->generateTrackingCode(
            $document_type->abbreviation
        );

        $document->is_draft = false;
        $document->status = "available";

        if (!$document->save()) {
            // if saving failed, return error
            return back()->with([
                "message" => "An error occured while finalizing the document.",
                "status" => "error",
            ]);
        }

        return to_route("documents.lists.finalized", [
            "document" => $document->id,
        ])->with([
            "message" => "Document finalized successfully.",
            "status" => "success",
        ]);
    }

    public function transfer(Request $request, Document $document)
    {
        $validated = $request->validate([
            "current_owner_id" => "required|exists:users,id",
        ]);

        $user = auth()->user();
        if ($document->current_owner_id !== $user->id) {
            abort(
                403,
                "Unauthorized action. You can only transfer the document if you currently own the document."
            );
        }

        $document->current_owner_id = $validated["current_owner_id"];
        $document->previous_owner_id = $user->id;

        if (!$document->save()) {
            // if saving failed, return error
            return back()->with([
                "message" =>
                    "An error occured while transferring the document.",
                "status" => "error",
            ]);
        }

        return back()->with([
            "message" => "Document transferred successfully.",
            "status" => "success",
        ]);
    }

    public function terminate(Document $document)
    {
        // set the status of the document to terminal
    }
}
