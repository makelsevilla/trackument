<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DocumentReleaseController extends Controller
{
    // Show the release document page
    public function release(Document $document)
    {
        $user = auth()->user();
        if (
            $document->current_owner_id !== $user->id ||
            $document->status === "terminal" ||
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
            ->select("id", "name")
            ->get();

        return Inertia::render("Document/ReleaseDocument", [
            "document" => $document,
            "releaseActions" => $document_release_actions,
            "offices" => $offices,
        ]);
    }

    // Transfer the current ownership of the document to another user
    public function transfer(Request $request, Document $document)
    {
        $user = auth()->user();
        if (
            $document->current_owner_id !== $user->id ||
            $document->status === "terminal" ||
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

        dd($validated);

        // process the transfer

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
}
