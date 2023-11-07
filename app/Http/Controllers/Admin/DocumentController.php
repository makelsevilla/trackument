<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = [
            "search" => $request->query("search"),
            "document_type_id" => $request->query("document_type_id"),
            "category" => $request->query("category", "title"),
            "created_at" => $request->query("created_at"),
            "sortBy" => $request->query("sortBy", "created_at"),
            "order" => $request->query("order", "desc"),
        ];

        $documents = Document::query()->with(["owner", "type"]);

        if (isset($filters["search"], $filters["category"])) {
            $documents->where(
                $filters["category"],
                "LIKE",
                "%{$filters["search"]}%"
            );
        }

        if (isset($filters["document_type_id"])) {
            $documents->where("document_type_id", $filters["document_type_id"]);
        }

        if (
            isset($filters["created_at"]["from"]) &&
            isset($filters["created_at"]["to"])
        ) {
            $documents->whereBetween("created_at", [
                $filters["created_at"]["from"],
                $filters["created_at"]["to"],
            ]);
        }

        if (isset($filters["sortBy"], $filters["order"])) {
            $documents->orderBy($filters["sortBy"], $filters["order"]);
        }

        $paginatedDocuments = $documents->paginate(10)->withQueryString();

        $documentTypes = DocumentType::all();
        return Inertia::render("Admin/Documents/DocumentsList", [
            "paginatedDocuments" => $paginatedDocuments,
            "documentTypes" => $documentTypes,
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
    public function show(Document $document)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Document $document)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Document $document)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        //
    }
}
