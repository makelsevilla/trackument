<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateDocumentRequest;
use App\Models\Document;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = [
            "search" => $request->query("search"),
            "document_type_id" => $request->query("document_type_id"),
            "category" => $request->query("category", "title"),
            "created_at" => $request->query("created_at"),
            "sortBy" => $request->query("sortBy", "created_at"),
            "order" => $request->query("order", "desc"),
        ];

        $documents = Document::query()->with(["owner", "type"]);

        if (isset($filters["search"], $filters["category"])) {
            $documents->where(
                $filters["category"],
                "LIKE",
                "%{$filters["search"]}%"
            );
        }

        if (isset($filters["document_type_id"])) {
            $documents->where("document_type_id", $filters["document_type_id"]);
        }

        if (
            isset($filters["created_at"]["from"]) &&
            isset($filters["created_at"]["to"])
        ) {
            $documents->whereBetween("created_at", [
                $filters["created_at"]["from"],
                $filters["created_at"]["to"],
            ]);
        }

        if (isset($filters["sortBy"], $filters["order"])) {
            $documents->orderBy($filters["sortBy"], $filters["order"]);
        }

        $paginatedDocuments = $documents->paginate(10)->withQueryString();

        $documentTypes = DocumentType::all();
        return Inertia::render("Admin/Documents/DocumentsList", [
            "paginatedDocuments" => $paginatedDocuments,
            "documentTypes" => $documentTypes,
            "filters" => $filters,
        ]);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Document $document)
    {
        $document->load(["owner", "type", "currentOwner"]);

        $documentFiles = DB::table("document_files")
            ->join("users", "document_files.uploader_id", "=", "users.id")
            ->where("document_files.document_id", "=", $document->id)
            ->select("document_files.*", "users.name as uploader_name")
            ->orderBy("document_files.uploaded_at", "desc")
            ->get();

        // getting the related documents code
        $document["related_documents"] = DB::table("related_documents")
            ->where("document_id", "=", $document->id)
            ->get();

        return Inertia::render("Admin/Documents/ViewDocument", [
            "document" => $document,
            "documentFiles" => $documentFiles,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Document $document)
    {
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

        return Inertia::render("Admin/Documents/EditDocument", [
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

        return to_route("admin.documents.index")->with([
            "message" => "Document saved successfully.",
            "status" => "success",
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        if ($document->delete()) {
            return to_route("admin.documents.index")->with([
                "message" => "Document deleted successfully.",
                "status" => "success",
            ]);
        } else {
            return to_route("admin.documents.index")->with([
                "message" => "Document deletion failed.",
                "status" => "error",
            ]);
        }
    }
}
