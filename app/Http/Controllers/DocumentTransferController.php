<?php

namespace App\Http\Controllers;

use App\Events\DocumentActionEvent;
use App\Events\NotificationEvent;
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
            "transferred_at" => now("Asia/Manila"),
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

        // dispatching the event
        $receiver = DB::table("users")
            ->where("id", "=", $validated["receiver_id"])
            ->select("name")
            ->first();

        $action_details = "Released to " . $receiver->name;
        event(
            new DocumentActionEvent(
                "released",
                $action_details,
                $document,
                $user
            )
        );

        return to_route("documents.lists.actionable")->with([
            "message" => "Document released successfully.",
            "status" => "success",
        ]);
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

        // check if the user is the receiver or the sender of the document transfer
        $user = auth()->user();
        if (
            $user->id !== $transferDetails->sender_id &&
            $user->id !== $transferDetails->receiver_id
        ) {
            abort(403, "Unauthorized/Invalid action.");
        }

        $documentDetails = DB::table("documents as d")
            ->join("users as u", "d.owner_id", "=", "u.id")
            ->where("d.id", "=", $transferDetails->document_id)
            ->select(
                "d.id",
                "d.title",
                "d.purpose",
                "d.tracking_code",
                "u.name as owner_name",
                "d.current_owner_id"
            )
            ->first();

        $withActionButtons = !$transferDetails->is_completed;
        $withDocumentLink = $documentDetails->current_owner_id === $user->id;

        return Inertia::render("Document/ViewDocumentTransfer", [
            "transferDetails" => $transferDetails,
            "documentDetails" => $documentDetails,
            "withActionButtons" => $withActionButtons,
            "withDocumentLink" => $withDocumentLink,
        ]);
    }

    public function accept(DocumentTransfer $documentTransfer)
    {
        // check if the transfer is already completed
        if ($documentTransfer->is_completed) {
            abort(403, "Unauthorized/Invalid action.");
        }

        $user = auth()->user();
        if ($user->id !== $documentTransfer->receiver_id) {
            abort(403, "Unauthorized/Invalid action.");
        }

        // accept the document transfer
        // update the document transfer row
        // update the document

        DB::beginTransaction(); // Start a database transaction

        try {
            $documentTransfer->status = "completed";
            $documentTransfer->is_completed = true;
            $documentTransfer->completed_at = now("Asia/Manila");
            $documentTransfer->save(); // Save the DocumentTransfer model

            $document = Document::find($documentTransfer->document_id);
            $document->status = "available";
            $document->previous_owner_id = $document->current_owner_id;
            $document->current_owner_id = $documentTransfer->receiver_id;
            $document->save(); // Save the Document model

            DB::commit(); // All changes were successful, so commit the transaction
        } catch (\Exception $e) {
            DB::rollBack(); // Something went wrong, so rollback the transaction

            // You can log the error or perform other error handling here
            return back()->with([
                "message" => "Document transfer failed. Please try again.",
                "status" => "error",
            ]);
        }

        // dispatching the event
        $action_details = "";
        event(
            new DocumentActionEvent(
                "accepted",
                $action_details,
                $document,
                $user
            )
        );

        return back()->with([
            "message" => "Document transfer successful.",
            "status" => "success",
        ]);
    }

    public function rejectOrCancelDocumentTransfer(
        DocumentTransfer $documentTransfer,
        $action
    ) {
        // check if the transfer is already completed
        if ($documentTransfer->is_completed) {
            abort(403, "Unauthorized/Invalid action.");
        }

        $user = auth()->user();

        // Determine the allowed actions based on the user's role
        $allowedActions = [];
        if ($user->id === $documentTransfer->sender_id) {
            $allowedActions = ["cancel"];
        } elseif ($user->id === $documentTransfer->receiver_id) {
            $allowedActions = ["reject"];
        } else {
            abort(403, "Unauthorized/Invalid action.");
        }

        if (!in_array($action, $allowedActions)) {
            abort(403, "Unauthorized/Invalid action.");
        }

        DB::beginTransaction(); // Start a database transaction

        $action_taken = "";
        try {
            if ($action === "reject") {
                $action_taken = "rejected";
                $documentTransfer->status = "rejected";
            } elseif ($action === "cancel") {
                $action_taken = "cancelled";
                $documentTransfer->status = "cancelled";
            }

            $documentTransfer->is_completed = true;
            $documentTransfer->completed_at = now("Asia/Manila");
            $documentTransfer->save();

            $document = Document::find($documentTransfer->document_id);
            $document->status = "available";
            $document->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack(); // Something went wrong, so rollback the transaction

            // You can log the error or perform other error handling here
            return back()->with([
                "message" => "Document transfer $action failed. Please try again.",
                "status" => "error",
            ]);
        }

        // dispatching the event
        $action_details = "";
        event(
            new DocumentActionEvent(
                $action_taken,
                $action_details,
                $document,
                $user
            )
        );

        return back()->with([
            "message" => "Document transfer $action successful.",
        ]);
    }

    public function reject(DocumentTransfer $documentTransfer)
    {
        return $this->rejectOrCancelDocumentTransfer(
            $documentTransfer,
            "reject"
        );
    }

    public function cancel(DocumentTransfer $documentTransfer)
    {
        return $this->rejectOrCancelDocumentTransfer(
            $documentTransfer,
            "cancel"
        );
    }
}
