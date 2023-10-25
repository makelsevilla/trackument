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
            ->select(
                "id",
                "title",
                "updated_at",
                "created_at",
                "tracking_code",
                "status"
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
