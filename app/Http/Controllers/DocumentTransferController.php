<?php

namespace App\Http\Controllers;

use App\Events\DocumentActionEvent;
use App\Events\DocumentTransferEvent;
use App\Events\NotificationEvent;
use App\Http\Requests\DocumentTransferRequest;
use App\Models\Document;
use App\Models\DocumentTransfer;
use App\Models\User;
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

    public function transfer(
        DocumentTransferRequest $request,
        Document $document
    ) {
        $user = auth()->user();
        if (
            $document->current_owner_id !== $user->id ||
            $document->status !== "available" ||
            $document->is_draft
        ) {
            abort(403, "Unauthorized/Invalid action.");
        }

        $document_transfer = DocumentTransfer::make(
            array_merge(
                [
                    "sender_id" => $user->id,
                    "document_id" => $document->id,
                    "transferred_at" => now("Asia/Manila"),
                ],
                $request->safe()->except(["receiver_name"])
            )
        );

        $validated = $request->validated();

        // if the receiver_id is null, mark the document transfer as completed
        if ($validated["receiver_id"] === null) {
            // convert the receiver_name to lowercase, then only allow single space between words and make the first letter of each word uppercase
            $validated["receiver_name"] = ucwords(
                preg_replace(
                    "/\s+/",
                    " ",
                    strtolower($validated["receiver_name"])
                )
            );

            $document_transfer->receiver_name = $validated["receiver_name"];
            $document_transfer->status = "completed";
            $document_transfer->is_completed = true;
            $document_transfer->completed_at = now("Asia/Manila");

            if ($document_transfer->save()) {
                $document->status = "terminal";
                $document->terminated_at = now("Asia/Manila");
                $additionalMessage = $document->save()
                    ? "The document is automatically tagged as terminal"
                    : " Failed to tag the document as terminal. You may manually tag the document as terminal in the document details page.";

                // create a history for the document
                event(
                    new DocumentActionEvent(
                        "released",
                        "Released to an individual named {$validated["receiver_name"]}",
                        $document,
                        $user
                    )
                );

                return to_route("documents.transfer.show", [
                    "documentTransferId" => $document_transfer->id,
                ])->with([
                    "message" => "Document is released to {$validated["receiver_name"]} successfully. {$additionalMessage}",
                    "status" => "success",
                ]);
            } else {
                return back()->with([
                    "message" => "Document releasing failed. Please try again.",
                    "status" => "error",
                ]);
            }
        }

        $document_transfer->save();

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

        $action_details = isset($receiver->name)
            ? "Released to {$receiver->name}"
            : "";
        event(
            new DocumentActionEvent(
                "released",
                $action_details,
                $document,
                $user
            )
        );

        DocumentTransferEvent::dispatch($document_transfer, "release");

        return to_route("documents.transfer.show", [
            "documentTransferId" => $document_transfer->id,
        ])->with([
            "message" => "Document is released to {$receiver->name} and is now pending for accepting.",
            "status" => "success",
        ]);
    }

    public function show(Request $request, $documentTransferId)
    {
        // shows document transfer page
        // document details needed: id, title, purpose, tracking_code, owner
        $transferDetails = DB::table("document_transfers as dt")
            ->join("users as u_sender", "dt.sender_id", "=", "u_sender.id")
            ->leftJoin(
                "users as u_receiver",
                "dt.receiver_id",
                "=",
                "u_receiver.id"
            )
            ->where("dt.id", "=", $documentTransferId)
            ->select(
                "dt.*",
                "u_sender.name as sender_name",
                "u_receiver.name as office_name"
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

        DocumentTransferEvent::dispatch($documentTransfer, "accept");

        return to_route("documents.lists.incoming")->with([
            "message" => "You have accepted document {$document->tracking_code} from {$documentTransfer->sender->name}. Don't forget to tag this document as TERMINAL in case your office is the end of its paper trail.",
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

        DocumentTransferEvent::dispatch($documentTransfer, $action);

        /*switch ($action) {
            case "reject":
                // create new notification event
                NotificationEvent::dispatch([
                    "user_id" => $documentTransfer->sender_id,
                    "message" =>
                        "Document {$document->tracking_code} release transfer has been rejected by " .
                        $user->name,
                ]);
                break;
            case "cancel":
                break;
            default:
        }*/

        if ($action === "reject") {
            return to_route("documents.lists.incoming")->with([
                "message" => "You have rejected document {$document->tracking_code} from {$documentTransfer->sender->name}.",
                "status" => "success",
            ]);
        }

        // if cancel
        return to_route("documents.lists.outgoing")->with([
            "message" => "You have cancelled document {$document->tracking_code} to {$documentTransfer->receiver->name}.",
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
