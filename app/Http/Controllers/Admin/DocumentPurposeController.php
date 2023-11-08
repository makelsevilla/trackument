<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DocumentPurposeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = [
            "search" => $request->query("search"),
            "category" => $request->query("category", "purpose"),
            "perPage" => $request->query("perPage", "10"),
        ];

        $documentPurposes = DB::table("document_purposes");

        if (isset($filters["search"], $filters["category"])) {
            $documentPurposes->where(
                $filters["category"],
                "LIKE",
                "%{$filters["search"]}%"
            );
        }

        $documentPurposes = $documentPurposes
            ->paginate($filters["perPage"])
            ->withQueryString();

        return Inertia::render("Admin/DocumentPurposes/DocumentPurposesList", [
            "paginate" => $documentPurposes,
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
        $request->merge(["purpose" => strtolower($request->purpose)]);
        $request->validate(["purpose" => "required|unique:document_purposes"]);

        $inserted = DB::table("document_purposes")->insert([
            "purpose" => $request->purpose,
        ]);

        if ($inserted) {
            return redirect()
                ->back()
                ->with("message", "Document purpose added.");
        } else {
            return redirect()
                ->back()
                ->with("message", "Failed to add document purpose.");
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $deleted = DB::table("document_purposes")
            ->where("id", $id)
            ->delete();

        if ($deleted) {
            return redirect()
                ->back()
                ->with("message", "Document purpose deleted.");
        } else {
            return redirect()
                ->back()
                ->with("message", "Failed to delete document purpose.");
        }
    }
}
