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
            ->where("owner_id", "=", $user->id)
            ->where("is_draft", "=", false)
            ->select("id", "title", "tracking_code", "current_owner_id")
            ->get();

        $documents = DB::table("documents")
            ->join("users", "documents.current_owner_id", "=", "users.id")
            ->join(
                "document_types",
                "documents.document_type_id",
                "=",
                "document_types.id"
            )
            ->select(
                "documents.id",
                "documents.title",
                "documents.tracking_code",
                "users.name as current_owner_name",
                "document_types.name as document_type_name",
                "documents.created_at"
            )
            ->get();

        return Inertia::render("Document/Lists/MyDocuments/Finalized", [
            "documents" => $documents,
        ]);
    }

    public function incoming()
    {
    }

    public function outgoing()
    {
    }
}
