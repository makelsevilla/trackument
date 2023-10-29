<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentTransfer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DocumentTransferController extends Controller
{
    // Show the release document page
    public function release(Document $document)
    {
        $user = auth()->user();
        if (
            $document->current_owner_id !== $user->id ||
            $document->status !== "available" ||
            $document->is_draft
        ) {
            abort(403, "Unauthorized/Invalid action.");
        }

        $document["previous_owner"] = $document
            ->getOwner("previous")
            ->select("name")
            ->first();

        $document["owner"] = $document
            ->getOwner("owner")
            ->select("name")
            ->first();

        $document_release_actions = DB::table("document_release_actions")
            ->select("action_name")
            ->get()
            ->toArray();

        $offices = DB::table("users")
            ->whereNot("id", "=", $user->id)
            ->select("id", "name")
            ->get();

        return Inertia::render("Document/ReleaseDocument", [
            "document" => $document,
            "releaseActions" => $document_release_actions,
            "offices" => $offices,
        ]);
    }

    public function transfer(Request $request, Document $document)
    {
        $user = auth()->user();
        if (
            $document->current_owner_id !== $user->id ||
            $document->status !== "available" ||
            $document->is_draft
        ) {
            abort(403, "Unauthorized/Invalid action.");
        }

        $validated = $request->validate([
            "receiver_id" => "required|exists:users,id",
            "release_action" =>
                "required|exists:document_release_actions,action_name",
            "comment" => "nullable|string|max:255",
        ]);

        $document_transfer = DocumentTransfer::create([
            "sender_id" => $user->id,
            "document_id" => $document->id,
            ...$validated,
        ]);

        // if document transfer creation is successful, set document status to pending.
        $document->status = "pending";
        if (!$document->save()) {
            // if document saving had failed. delete the document_transfer
            $document_transfer->delete();

            // then return error
            return back()->with([
                "message" => "Document releasing failed. Please try again.",
                "status" => "error",
            ]);
        }

        return to_route("documents.lists.actionable")->with([
            "message" => "Document transferred successfully.",
            "status" => "success",
        ]);
    }

    // deletes the Document Transfer
    public function cancel()
    {
    }

    public function show(Request $request, $documentTransferId)
    {
        // shows document transfer page
        // document details needed: id, title, purpose, tracking_code, owner
        $transferDetails = DB::table("document_transfers as dt")
            ->join("users as u_sender", "dt.sender_id", "=", "u_sender.id")
            ->join(
                "users as u_receiver",
                "dt.receiver_id",
                "=",
                "u_receiver.id"
            )
            ->where("dt.id", "=", $documentTransferId)
            ->select(
                "dt.*",
                "u_sender.name as sender_name",
                "u_receiver.name as receiver_name"
            )
            ->first();

        $documentDetails = DB::table("documents as d")
            ->join("users as u", "d.owner_id", "=", "u.id")
            ->where("d.id", "=", $transferDetails->document_id)
            ->select(
                "d.id",
                "d.title",
                "d.purpose",
                "d.tracking_code",
                "u.name as owner_name"
            )
            ->first();

        return Inertia::render("Document/ViewDocumentTransfer", [
            "transferDetails" => $transferDetails,
            "documentDetails" => $documentDetails,
        ]);
    }

    public function accept()
    {
        // accept the document transfer
        // update the document transfer row
        // update the document
    }

    public function reject()
    {
    }
}
