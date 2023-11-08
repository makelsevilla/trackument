<?php

namespace App\Http\Controllers\Admin;

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
            "date_range_by" => $request->query(
                "date_range_by",
                "transferred_at"
            ),
            "date" => $request->query("date"),
            "status" => $request->query("status"),
            "perPage" => $request->query("perPage", "10"),
        ];

        $transfers = DocumentTransfer::query()->with(
            "document",
            "sender",
            "receiver"
        );

        if (isset($filters["search"], $filters["category"])) {
            $relationMapping = [
                "tracking_code" => "document",
                "sender" => "sender",
                "receiver" => "receiver",
            ];

            $transfers->whereHas(
                $relationMapping[$filters["category"]],
                function ($query) use ($filters) {
                    $query->where(
                        $filters["category"],
                        "LIKE",
                        "%{$filters["search"]}%"
                    );
                }
            );
        }

        if (isset($filters["sortBy"], $filters["order"])) {
            $transfers->orderBy($filters["sortBy"], $filters["order"]);
        }

        if (
            isset(
                $filters["date_range_by"],
                $filters["date"]["from"],
                $filters["date"]["to"]
            )
        ) {
            $transfers->whereBetween($filters["date_range_by"], [
                $filters["date"]["from"],
                $filters["date"]["to"],
            ]);
        }

        if (isset($filters["status"])) {
            $transfers->where("status", $filters["status"]);
        }

        // check if report is present in the request
        if ($request->query("report")) {
            // convert the date into a readable format
            $date = "";
            if (isset($filters["date"]["from"], $filters["date"]["to"])) {
                $dateFrom = date("F j, Y", strtotime($filters["date"]["from"]));
                $dateTo = date("F j, Y", strtotime($filters["date"]["to"]));

                $date = "From {$dateFrom} to {$dateTo}";
            }

            // if report is present, then return the report page
            return Inertia::render("Report/TransferLogs", [
                "transfers" => $transfers->get(),
                "filters" => [...$filters, "date" => $date],
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
