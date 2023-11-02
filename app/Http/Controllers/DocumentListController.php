<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Database\Query\JoinClause;
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

    public function finalized(Request $request)
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
            ->orderBy("documents.updated_at", "desc");

        $filters = [
            "filter" => $request->query("filter"),
            "category" => $request->query("category", "document_title"),
            "date" => $request->query("date"),
        ];

        // filtering categories
        $categoryMapping = [
            "document_title" => "documents.title",
            "document_type" => "document_types.name",
            "tracking_code" => "documents.tracking_code",
        ];

        if (isset($filters["category"], $filters["filter"])) {
            $documents = $documents->where(
                $categoryMapping[$filters["category"]],
                "like",
                "%" . $filters["filter"] . "%"
            );
        }

        if (isset($filters["date"]["from"]) && isset($filters["date"]["to"])) {
            $documents = $documents->whereBetween("documents.created_at", [
                $filters["date"]["from"],
                $filters["date"]["to"],
            ]);
        }

        $documents = $documents->paginate()->withQueryString();
        return Inertia::render("Document/Lists/MyDocuments/Finalized", [
            "paginatedDocuments" => $documents,
            "filters" => $filters,
        ]);
    }

    public function terminalTagged(Request $request)
    {
        // get the documents that are currently owned by the user
        $user = auth()->user();
        $documents = DB::table("documents as d")
            ->join("users as u_owner", "d.owner_id", "=", "u_owner.id")
            ->join(
                "document_types as type",
                "d.document_type_id",
                "=",
                "type.id"
            )
            ->leftJoin(
                "users as u_previous",
                "d.previous_owner_id",
                "=",
                "u_previous.id"
            )
            ->where("d.current_owner_id", "=", $user->id)
            ->where("d.status", "=", "terminal")
            ->select(
                "d.*",
                "u_owner.name as owner_name",
                "u_previous.name as previous_owner_name",
                "type.name as document_type_name"
            );

        $filters = [
            "filter" => $request->query("filter"),
            "category" => $request->query("category", "document_title"),
            "date" => $request->query("date"),
        ];

        // filtering categories
        $categoryMapping = [
            "owner" => "u_owner.name",
            "document_title" => "d.title",
            "document_type" => "type.name",
            "tracking_code" => "d.tracking_code",
        ];

        if (isset($filters["category"], $filters["filter"])) {
            $documents = $documents->where(
                $categoryMapping[$filters["category"]],
                "like",
                "%" . $filters["filter"] . "%"
            );
        }

        if (isset($filters["date"]["from"]) && isset($filters["date"]["to"])) {
            $documents = $documents->whereBetween("d.terminated_at", [
                $filters["date"]["from"],
                $filters["date"]["to"],
            ]);
        }

        $documents = $documents->paginate()->withQueryString();
        return Inertia::render("Document/Lists/TerminalTagged", [
            "paginatedDocuments" => $documents,
            "filters" => $filters,
        ]);
    }

    public function actionable(Request $request)
    {
        // get the documents that are currently owned by the user
        $user = auth()->user();

        // grouping the document transfer table by document_id and getting the latest document transfer
        $latestDocumentsTransfer = DB::table("document_transfers as dt_a")
            ->joinSub(
                DB::table("document_transfers")
                    ->select(
                        "document_id",
                        DB::raw("MAX(transferred_at) as transferred_at")
                    )
                    ->groupBy("document_id"),
                "dt_b",
                function (JoinClause $join) {
                    $join->on("dt_a.document_id", "=", "dt_b.document_id");
                    $join->on(
                        "dt_a.transferred_at",
                        "=",
                        "dt_b.transferred_at"
                    );
                }
            )
            ->select("dt_a.*");

        $documents = DB::table("documents as d")
            ->join("users as u", "d.previous_owner_id", "=", "u.id")
            ->where("d.current_owner_id", "=", $user->id)
            ->where("d.status", "=", "available")
            ->joinSub($latestDocumentsTransfer, "dt", function (
                JoinClause $join
            ) {
                $join->on("d.id", "=", "dt.document_id");
            })
            ->select(
                "d.*",
                "u.name as previous_owner_name",
                "dt.completed_at as date_received",
                "dt.id as document_transfer_id"
            );

        // Adding filters
        $filters = [
            "filter" => $request->query("filter"),
            "category" => $request->query("category", "document_title"),
            "date" => $request->query("date"),
        ];

        // filtering categories
        $categoryMapping = [
            "sender" => "u.name",
            "document_title" => "d.title",
            "tracking_code" => "d.tracking_code",
        ];

        if (isset($filters["category"], $filters["filter"])) {
            $documents = $documents->where(
                $categoryMapping[$filters["category"]],
                "like",
                "%" . $filters["filter"] . "%"
            );
        }

        if (isset($filters["date"]["from"]) && isset($filters["date"]["to"])) {
            $documents = $documents->whereBetween("dt.completed_at", [
                $filters["date"]["from"],
                $filters["date"]["to"],
            ]);
        }

        $documents = $documents->paginate()->withQueryString();
        return Inertia::render("Document/Lists/Actionable", [
            "paginatedDocuments" => $documents,
            "filters" => $filters,
        ]);
    }

    public function incoming(Request $request)
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
            );

        // Adding filters
        $filters = [
            "filter" => $request->query("filter"),
            "category" => $request->query("category", "document_title"),
            "date" => $request->query("date"),
        ];

        // filtering categories
        $categoryMapping = [
            "sender" => "u.name",
            "document_title" => "d.title",
        ];

        if (isset($filters["category"], $filters["filter"])) {
            $dt = $dt->where(
                $categoryMapping[$filters["category"]],
                "like",
                "%" . $filters["filter"] . "%"
            );
        }

        if (isset($filters["date"]["from"]) && isset($filters["date"]["to"])) {
            $dt = $dt->whereBetween("dt.transferred_at", [
                $filters["date"]["from"],
                $filters["date"]["to"],
            ]);
        }

        $dt = $dt->paginate()->withQueryString();

        return Inertia::render("Document/Lists/Incoming", [
            "paginatedDocumentTransfers" => $dt,
            "filters" => $filters,
        ]);
    }

    public function outgoing()
    {
        // get the document transfers that are not yet completed and that the sender_id is equal to the user id
        $user = auth()->user();
        $dt = DB::table("document_transfers as dt")
            ->join("documents as d", "dt.document_id", "=", "d.id")
            ->join("users as u", "dt.receiver_id", "=", "u.id")
            ->where("dt.sender_id", "=", $user->id)
            ->where("dt.is_completed", "=", false)
            ->select(
                "d.tracking_code",
                "d.title",
                "u.name as receiver_name",
                "dt.transferred_at as date_released",
                "dt.id"
            )
            ->get();

        return Inertia::render("Document/Lists/Outgoing", [
            "documentTransfers" => $dt,
        ]);
    }

    public function transferLogs()
    {
        // get the document transfers that are completed and that the sender_id or receiver_id is equal to the user id
        $user = auth()->user();
        $dt = DB::table("document_transfers as dt")
            ->join("documents as d", "dt.document_id", "=", "d.id")
            ->join("users as u_sender", "dt.sender_id", "=", "u_sender.id")
            ->join(
                "users as u_receiver",
                "dt.receiver_id",
                "=",
                "u_receiver.id"
            )
            ->where("dt.sender_id", "=", $user->id)
            ->orWhere("dt.receiver_id", "=", $user->id)
            ->where("dt.is_completed", "=", true)
            ->select(
                "d.title as document_title",
                "d.tracking_code as document_tracking_code",
                "dt.id",
                "dt.transferred_at as date_released",
                "dt.completed_at as date_completed",
                "dt.status",
                "u_sender.name as sender_name",
                "u_receiver.name as receiver_name"
            )
            ->get();

        //        dd($dt);
        return Inertia::render("Document/Lists/TransferLogs", [
            "documentTransfers" => $dt,
        ]);
    }
}
