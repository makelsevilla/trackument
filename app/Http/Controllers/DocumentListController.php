<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentTransfer;
use Illuminate\Database\Eloquent\Builder;
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
        $filters = [
            "search" => $request->query("search"),
            "category" => $request->query("category", "tracking_code"),
            "sortBy" => $request->query("sortBy", "created_at"),
            "order" => $request->query("order", "desc"),
            "perPage" => $request->query("perPage", "10"),
            "date_name" => $request->query("date_name", "created_at"),
            "date_from" => $request->query("date_from"),
            "date_to" => $request->query("date_to", now()),
        ];

        $user = auth()->user();

        $documents = Document::where("owner_id", "=", $user->id)->whereNot(
            "is_draft",
            "=",
            true
        );

        if (isset($filters["search"], $filters["category"])) {
            $documents->where(
                $filters["category"],
                "LIKE",
                "%{$filters["search"]}%"
            );
        }

        if (isset($filters["sortBy"], $filters["order"])) {
            $documents->orderBy($filters["sortBy"], $filters["order"]);
        }

        if (isset($filters["date_to"], $filters["date_name"])) {
            $documents->whereDate(
                $filters["date_name"],
                "<=",
                $filters["date_to"]
            );
            if (isset($filters["date_from"])) {
                $documents->whereDate(
                    $filters["date_name"],
                    ">=",
                    $filters["date_from"]
                );
            }
        }

        $paginatedDocuments = $documents
            ->paginate($filters["perPage"])
            ->withQueryString();

        return Inertia::render("Document/Lists/MyDocuments/Finalized", [
            "paginatedDocuments" => $paginatedDocuments,
            "filters" => $filters,
        ]);
    }

    public function terminalTagged(Request $request)
    {
        $filters = [
            "search" => $request->query("search"),
            "category" => $request->query("category", "tracking_code"),
            "sortBy" => $request->query("sortBy", "terminated_at"),
            "order" => $request->query("order", "desc"),
            "perPage" => $request->query("perPage", "10"),
            "date_name" => $request->query("date_name", "terminated_at"),
            "date_from" => $request->query("date_from"),
            "date_to" => $request->query("date_to", now()),
        ];

        // get the documents that are currently owned by the user
        $user = auth()->user();

        $documents = Document::with(["owner"])
            ->where("current_owner_id", "=", $user->id)
            ->where("status", "=", "terminal");

        if (isset($filters["search"], $filters["category"])) {
            $relationMapping = [
                "owner" => "owner",
            ];

            if (isset($relationMapping[$filters["category"]])) {
                $documents->whereHas(
                    $relationMapping[$filters["category"]],
                    function ($query) use ($filters) {
                        $columnMap = ["owner" => "name"];

                        $column =
                            $columnMap[$filters["category"]] ??
                            $filters["category"];

                        $query->where(
                            $column,
                            "LIKE",
                            "%{$filters["search"]}%"
                        );
                    }
                );
            } else {
                $documents->where(
                    $filters["category"],
                    "LIKE",
                    "%{$filters["search"]}%"
                );
            }
        }

        if (isset($filters["sortBy"], $filters["order"])) {
            $documents->orderBy($filters["sortBy"], $filters["order"]);
        }

        if (isset($filters["date_to"], $filters["date_name"])) {
            $documents->whereDate(
                $filters["date_name"],
                "<=",
                $filters["date_to"]
            );
            if (isset($filters["date_from"])) {
                $documents->whereDate(
                    $filters["date_name"],
                    ">=",
                    $filters["date_from"]
                );
            }
        }

        $paginatedDocuments = $documents
            ->paginate($filters["perPage"])
            ->withQueryString();
        return Inertia::render("Document/Lists/TerminalTagged", [
            "paginatedDocuments" => $paginatedDocuments,
            "filters" => $filters,
        ]);
    }

    public function actionable(Request $request)
    {
        // get the documents that are currently owned by the user
        $filters = [
            "search" => $request->query("search"),
            "category" => $request->query("category", "tracking_code"),
            "sortBy" => $request->query("sortBy", "completed_at"),
            "order" => $request->query("order", "desc"),
            "perPage" => $request->query("perPage", "10"),
            "date_name" => $request->query("date_name", "completed_at"),
            "date_from" => $request->query("date_from"),
            "date_to" => $request->query("date_to", now()),
        ];

        $user = auth()->user();

        // grouping the document transfer table by document_id and getting the latest document transfer
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

        $documents = DB::table("documents")
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
            );

        if (isset($filters["search"], $filters["category"])) {
            $categoriesMapping = [
                "tracking_code" => "documents.tracking_code",
                "title" => "documents.title",
                "sender" => "u.name",
            ];

            $documents->where(
                $categoriesMapping[$filters["category"]],
                "LIKE",
                "%{$filters["search"]}%"
            );
        }

        if (isset($filters["sortBy"], $filters["order"])) {
            $documents->orderBy(
                "document_transfers.completed_at",
                $filters["order"]
            );
        }

        if (isset($filters["date_to"], $filters["date_name"])) {
            $dateNameMapping = [
                "completed_at" => "document_transfers.completed_at",
            ];

            $documents->whereDate(
                $dateNameMapping[$filters["date_name"]],
                "<=",
                $filters["date_to"]
            );

            if (isset($filters["date_from"])) {
                $documents->whereDate(
                    $dateNameMapping[$filters["date_name"]],
                    ">=",
                    $filters["date_from"]
                );
            }
        }

        $paginatedDocuments = $documents
            ->paginate($filters["perPage"])
            ->withQueryString();

        return Inertia::render("Document/Lists/Actionable", [
            "paginatedDocuments" => $paginatedDocuments,
            "filters" => $filters,
        ]);
    }

    public function incoming(Request $request)
    {
        // get the document transfers that are not yet completed and that the sender_id is equal to the user id
        $filters = [
            "search" => $request->query("search"),
            "category" => $request->query("category", "tracking_code"),
            "sortBy" => $request->query("sortBy", "transferred_at"),
            "order" => $request->query("order", "desc"),
            "perPage" => $request->query("perPage", "10"),
            "date_name" => $request->query("date_name", "transferred_at"),
            "date_from" => $request->query("date_from"),
            "date_to" => $request->query("date_to", now()),
        ];

        // get the document transfers that are completed and that the sender_id or receiver_id is equal to the user id
        $user = auth()->user();
        $transfers = DocumentTransfer::query()
            ->with(["document", "sender", "receiver"])
            ->whereHas("receiver", function ($query) use ($user) {
                $query->where("id", "=", $user->id);
            })
            ->whereNot("is_completed", "=", true);

        if (isset($filters["search"], $filters["category"])) {
            $relationMapping = [
                "tracking_code" => "document",
                "title" => "document",
                "sender" => "sender",
            ];

            $transfers->whereHas(
                $relationMapping[$filters["category"]],
                function ($query) use ($filters) {
                    $columnMap = [
                        "sender" => "name",
                    ];

                    $column =
                        $columnMap[$filters["category"]] ??
                        $filters["category"];

                    $query->where($column, "LIKE", "%{$filters["search"]}%");
                }
            );
        }

        if (isset($filters["sortBy"], $filters["order"])) {
            $transfers->orderBy($filters["sortBy"], $filters["order"]);
        }

        if (isset($filters["date_to"], $filters["date_name"])) {
            $transfers->whereDate(
                $filters["date_name"],
                "<=",
                $filters["date_to"]
            );
            if (isset($filters["date_from"])) {
                $transfers->whereDate(
                    $filters["date_name"],
                    ">=",
                    $filters["date_from"]
                );
            }
        }

        $paginatedTransfers = $transfers
            ->paginate($filters["perPage"])
            ->withQueryString();

        return Inertia::render("Document/Lists/Incoming", [
            "paginatedDocumentTransfers" => $paginatedTransfers,
            "filters" => $filters,
        ]);
    }

    public function outgoing(Request $request)
    {
        // get the document transfers that are not yet completed and that the sender_id is equal to the user id
        $filters = [
            "search" => $request->query("search"),
            "category" => $request->query("category", "tracking_code"),
            "sortBy" => $request->query("sortBy", "transferred_at"),
            "order" => $request->query("order", "desc"),
            "perPage" => $request->query("perPage", "10"),
            "date_name" => $request->query("date_name", "transferred_at"),
            "date_from" => $request->query("date_from"),
            "date_to" => $request->query("date_to", now()),
        ];

        // get the document transfers that are completed and that the sender_id or receiver_id is equal to the user id
        $user = auth()->user();
        $transfers = DocumentTransfer::query()
            ->with(["document", "sender", "receiver"])
            ->whereHas("sender", function ($query) use ($user) {
                $query->where("id", "=", $user->id);
            })
            ->whereNot("is_completed", "=", true);

        if (isset($filters["search"], $filters["category"])) {
            $relationMapping = [
                "tracking_code" => "document",
                "title" => "document",
                "receiver" => "receiver",
            ];

            $transfers->whereHas(
                $relationMapping[$filters["category"]],
                function ($query) use ($filters) {
                    $columnMap = [
                        "receiver" => "name",
                    ];

                    $column =
                        $columnMap[$filters["category"]] ??
                        $filters["category"];

                    $query->where($column, "LIKE", "%{$filters["search"]}%");
                }
            );
        }

        if (isset($filters["sortBy"], $filters["order"])) {
            $transfers->orderBy($filters["sortBy"], $filters["order"]);
        }

        if (isset($filters["date_to"], $filters["date_name"])) {
            $transfers->whereDate(
                $filters["date_name"],
                "<=",
                $filters["date_to"]
            );
            if (isset($filters["date_from"])) {
                $transfers->whereDate(
                    $filters["date_name"],
                    ">=",
                    $filters["date_from"]
                );
            }
        }

        $paginatedTransfers = $transfers
            ->paginate($filters["perPage"])
            ->withQueryString();
        return Inertia::render("Document/Lists/Outgoing", [
            "paginatedDocumentTransfers" => $paginatedTransfers,
            "filters" => $filters,
        ]);
    }

    public function transferLogs(Request $request)
    {
        $filters = [
            "search" => $request->query("search"),
            "category" => $request->query("category", "tracking_code"),
            "sortBy" => $request->query("sortBy", "transferred_at"),
            "order" => $request->query("order", "desc"),
            "perPage" => $request->query("perPage", "10"),
            "date_name" => $request->query("date_name", "transferred_at"),
            "date_from" => $request->query("date_from"),
            "date_to" => $request->query("date_to", now()),
            "status" => $request->query("status"),
        ];

        // get the document transfers that are completed and that the sender_id or receiver_id is equal to the user id
        $user = auth()->user();
        $transfers = DocumentTransfer::query()
            ->with(["document", "sender", "receiver"])
            ->where(function (Builder $query) use ($user) {
                $query
                    ->whereHas("receiver", function ($query) use ($user) {
                        $query->where("id", "=", $user->id);
                    })
                    ->orWhereHas("sender", function ($query) use ($user) {
                        $query->where("id", "=", $user->id);
                    });
            });

        if (isset($filters["search"], $filters["category"])) {
            $relationMapping = [
                "tracking_code" => "document",
                "sender" => "sender",
                "receiver" => "receiver",
            ];

            $transfers->whereHas(
                $relationMapping[$filters["category"]],
                function ($query) use ($filters) {
                    $columnMap = [
                        "sender" => "name",
                        "receiver" => "name",
                    ];

                    $column =
                        $columnMap[$filters["category"]] ??
                        $filters["category"];
                    $query->where($column, "LIKE", "%{$filters["search"]}%");
                }
            );
        }

        if (isset($filters["sortBy"], $filters["order"])) {
            $transfers->orderBy($filters["sortBy"], $filters["order"]);
        }

        if (isset($filters["date_to"], $filters["date_name"])) {
            $transfers->whereDate(
                $filters["date_name"],
                "<=",
                $filters["date_to"]
            );
            if (isset($filters["date_from"])) {
                $transfers->whereDate(
                    $filters["date_name"],
                    ">=",
                    $filters["date_from"]
                );
            }
        }

        if (isset($filters["status"])) {
            $transfers->where("status", $filters["status"]);
        }

        // check if report is present in the request
        if ($request->query("report")) {
            // transfer dates into readable format
            $filters["date_from"] = isset($filters["date_from"])
                ? \Date::create($filters["date_from"])->format("M-d-Y")
                : null;

            $filters["date_to"] = isset($filters["date_to"])
                ? \Date::create($filters["date_to"])->format("M-d-Y")
                : null;

            // if report is present, then return the report page
            return Inertia::render("Report/TransferLogs", [
                "transfers" => $transfers->get(),
                "filters" => [...$filters],
            ]);
        }

        $paginatedTransfers = $transfers
            ->paginate($filters["perPage"])
            ->withQueryString();
        return Inertia::render("Document/Lists/TransferLogs", [
            "paginatedTransfers" => $paginatedTransfers,
            "filters" => $filters,
        ]);
    }
}
