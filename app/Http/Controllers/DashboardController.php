<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentTransfer;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function user()
    {
        $user = auth()->user();

        /*Getting the counts*/
        $myDocumentsCount = $user
            ->documents()
            ->where("is_draft", false)
            ->count();
        $taggedAsTerminalCount = Document::where(function ($query) use ($user) {
            $query
                ->where("owner_id", "=", $user->id)
                ->orWhere("current_owner_id", "=", $user->id);
        })
            ->where("status", "=", "terminal")
            ->count();
        $draftDocumentsCount = $user
            ->documents()
            ->where("is_draft", true)
            ->count();
        /*End Getting the counts*/

        // getting the recent transfer lists
        $latestTranfers = DB::table("document_transfers as dt_a")
            ->joinSub(
                DB::table("document_transfers")
                    ->select(
                        "document_id",
                        DB::raw("MAX(completed_at) as completed_at")
                    )
                    ->groupBy("document_id"),
                "dt_b",
                function (JoinClause $join) {
                    $join->on("dt_a.document_id", "=", "dt_b.document_id");
                    $join->on("dt_a.completed_at", "=", "dt_b.completed_at");
                }
            )
            ->select("dt_a.*");

        $actionable = DB::table("documents")
            ->join("users as u", "documents.previous_owner_id", "=", "u.id")
            ->where("documents.current_owner_id", "=", $user->id)
            ->where("documents.status", "=", "available")
            ->joinSub($latestTranfers, "document_transfers", function (
                JoinClause $join
            ) {
                $join->on(
                    "documents.id",
                    "=",
                    "document_transfers.document_id"
                );
            })
            ->select(
                "documents.*",
                "u.name as previous_owner_name",
                "document_transfers.completed_at as document_transfers_completed_at",
                "document_transfers.id as document_transfers_id"
            )
            ->limit(5)
            ->get();

        $incoming = DocumentTransfer::query()
            ->with(["document", "sender", "receiver"])
            ->whereHas("receiver", function ($query) use ($user) {
                $query->where("id", "=", $user->id);
            })
            ->whereNot("is_completed", "=", true)
            ->limit(5)
            ->get();

        $outgoing = DocumentTransfer::query()
            ->with(["document", "sender", "receiver"])
            ->whereHas("sender", function ($query) use ($user) {
                $query->where("id", "=", $user->id);
            })
            ->whereNot("is_completed", "=", true)
            ->limit(5)
            ->get();

        return Inertia::render("Dashboard", [
            "counts" => [
                "myDocument" => $myDocumentsCount,
                "taggedAsTerminal" => $taggedAsTerminalCount,
                "draftDocument" => $draftDocumentsCount,
            ],
            "transfers" => [
                "actionable" => $actionable,
                "incoming" => $incoming,
                "outgoing" => $outgoing,
            ],
        ]);
    }

    public function admin()
    {
        return Inertia::render("Admin/Dashboard");
    }
}
