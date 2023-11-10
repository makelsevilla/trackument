<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Controller;
use App\Models\DocumentTransfer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentTransferController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = [
            "search" => $request->query("search"),
            "category" => $request->query("category", "tracking_code"),
            "sortBy" => $request->query("sortBy", "transferred_at"),
            "order" => $request->query("order", "desc"),
            "perPage" => $request->query("perPage", "10"),
            "date_name" => $request->query("date_name", "transferred_at"),
            "date_from" => $request->query("date_from"),
            "date_to" => $request->query("date_to", now()->toDateString()),
            "status" => $request->query("status"),
        ];

        //        dd($filters["date_from"], $filters["date_to"]);
        $transfers = DocumentTransfer::query()->with([
            "document",
            "sender",
            "receiver",
        ]);

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

        return Inertia::render("Admin/Transfers/TransfersList", [
            "paginatedTransfers" => $paginatedTransfers,
            "filters" => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(DocumentTransfer $documentTransfer)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DocumentTransfer $documentTransfer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DocumentTransfer $documentTransfer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DocumentTransfer $documentTransfer)
    {
        //
    }
}
