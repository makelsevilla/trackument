<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DocumentListController extends Controller
{
    public function drafts()
    {
        $user = auth()->user();
        $documents = DB::table("documents")
            ->where("owner_id", "=", $user->id)
            ->where("is_draft", "=", true)
            ->select("id", "title", "updated_at", "created_at")
            ->get();

        return Inertia::render("Document/Lists/MyDocuments/Draft", [
            "documents" => $documents,
        ]);
    }

    public function finalized()
    {
        $user = auth()->user();

        $documents = DB::table("documents")
            ->join("users", "documents.current_owner_id", "=", "users.id")
            ->join(
                "document_types",
                "documents.document_type_id",
                "=",
                "document_types.id"
            )
            ->where("documents.owner_id", "=", $user->id)
            ->where("documents.is_draft", "=", false)
            ->select(
                "documents.id",
                "documents.title",
                "documents.tracking_code",
                "users.name as current_owner_name",
                "document_types.name as document_type_name",
                "documents.created_at"
            )
            ->orderBy("documents.updated_at", "desc")
            ->get();

        return Inertia::render("Document/Lists/MyDocuments/Finalized", [
            "documents" => $documents,
        ]);
    }

    public function actionable()
    {
        // get the documents that are currently owned by the user
        $user = auth()->user();
        $documents = DB::table("documents as d")
            ->join("users as u", "d.previous_owner_id", "=", "u.id")
            ->where("d.current_owner_id", "=", $user->id)
            ->where("d.status", "=", "available")
            ->select("d.*", "u.name as previous_owner_name")
            ->get();

        return Inertia::render("Document/Lists/Actionable", [
            "documents" => $documents,
        ]);
    }

    public function incoming()
    {
        // get the document transfers that are not yet completed and that the receiver_id is equal to the user id
        $user = auth()->user();

        $dt = DB::table("document_transfers as dt")
            ->join("documents as d", "dt.document_id", "=", "d.id")
            ->join("users as u", "dt.sender_id", "=", "u.id")
            ->where("dt.receiver_id", "=", $user->id)
            ->where("dt.is_completed", "=", false)
            ->select(
                "d.title",
                "u.name as sender_name",
                "d.purpose",
                "dt.transferred_at as date_released",
                "dt.id"
            )
            ->get();

        return Inertia::render("Document/Lists/Incoming", [
            "documentTransfers" => $dt,
        ]);
    }

    public function outgoing()
    {
    }
}
