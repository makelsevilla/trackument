<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DocumentReleaseActionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = [
            "search" => $request->query("search"),
            "category" => $request->query("category", "action_name"),
            "sortBy" => $request->query("sortBy", "action_name"),
            "order" => $request->query("order", "desc"),
            "perPage" => $request->query("perPage", "10"),
        ];

        $releaseActions = DB::table("document_release_actions");

        if (isset($filters["search"], $filters["category"])) {
            $releaseActions->where(
                $filters["category"],
                "LIKE",
                "%{$filters["search"]}%"
            );
        }

        if (isset($filters["sortBy"], $filters["order"])) {
            $releaseActions->orderBy($filters["sortBy"], $filters["order"]);
        }

        $releaseActions = $releaseActions
            ->paginate($filters["perPage"])
            ->withQueryString();

        return Inertia::render(
            "Admin/DocumentReleaseActions/ReleaseActionsList",
            [
                "paginate" => $releaseActions,
                "filters" => $filters,
            ]
        );
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
        $request->merge(["action_name" => strtolower($request->action_name)]);
        $request->validate([
            "action_name" => "required|unique:document_release_actions",
        ]);

        $inserted = DB::table("document_release_actions")->insert([
            "action_name" => $request->action_name,
        ]);

        if ($inserted) {
            return redirect()
                ->back()
                ->with("message", "Release action added.");
        } else {
            return redirect()
                ->back()
                ->with("message", "Failed to add release action.");
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
        $deleted = DB::table("document_release_actions")
            ->where("id", $id)
            ->delete();

        if ($deleted) {
            return redirect()
                ->back()
                ->with("message", "Release action deleted.");
        } else {
            return redirect()
                ->back()
                ->with("message", "Failed to delete release action.");
        }
    }
}
