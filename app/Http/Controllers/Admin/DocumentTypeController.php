<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DocumentTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = [
            "search" => $request->query("search"),
            "category" => $request->query("category", "name"),
            "created_at" => $request->query("created_at"),
            "sortBy" => $request->query("sortBy", "created_at"),
            "order" => $request->query("order", "desc"),
            "perPage" => $request->query("perPage", "10"),
        ];

        $documentType = DocumentType::query();

        if (isset($filters["search"], $filters["category"])) {
            $documentType->where(
                $filters["category"],
                "LIKE",
                "%{$filters["search"]}%"
            );
        }

        if (
            isset($filters["created_at"]["from"]) &&
            isset($filters["created_at"]["to"])
        ) {
            $documentType->whereBetween("created_at", [
                $filters["created_at"]["from"],
                $filters["created_at"]["to"],
            ]);
        }

        if (isset($filters["sortBy"], $filters["order"])) {
            $documentType->orderBy($filters["sortBy"], $filters["order"]);
        }

        $documentType = $documentType
            ->paginate($filters["perPage"])
            ->withQueryString();
        return Inertia::render("Admin/DocumentTypes/DocumentTypesList", [
            "paginate" => $documentType,
            "filters" => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("Admin/DocumentTypes/CreateDocumentType");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // transform all values to lowercase
        $request->merge([
            "name" => strtolower($request->name),
            "description" => strtolower($request->description),
            "abbreviation" => strtoupper($request->abbreviation),
        ]);

        $request->validate([
            "name" => [
                "required",
                "string",
                "max:255",
                "unique:document_types",
            ],
            "abbreviation" => ["required", "string", "max:255"],
            "description" => ["nullable", "string", "max:255"],
        ]);

        if (DocumentType::create($request->all())) {
            return redirect()
                ->route("admin.document-types.index")
                ->with("message", "Document type created successfully");
        } else {
            return redirect()
                ->back()
                ->with("message", "Document type could not be created");
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(DocumentType $documentType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DocumentType $documentType)
    {
        return Inertia::render("Admin/DocumentTypes/EditDocumentType", [
            "documentType" => $documentType,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DocumentType $documentType)
    {
        // transform all values to lowercase
        $request->merge([
            "name" => strtolower($request->name),
            "description" => strtolower($request->description),
            "abbreviation" => strtoupper($request->abbreviation),
        ]);

        $request->validate([
            "name" => [
                "required",
                "string",
                "max:255",
                Rule::unique("document_types")->ignore($documentType->id),
            ],
            "abbreviation" => ["required", "string", "max:255"],
            "description" => ["nullable", "string", "max:255"],
        ]);

        if ($documentType->update($request->all())) {
            return redirect()
                ->route("admin.document-types.index")
                ->with("message", "Document type updated successfully");
        } else {
            return redirect()
                ->back()
                ->with("message", "Document type could not be updated");
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DocumentType $documentType)
    {
        // check if any document is using this document type
        if ($documentType->documents()->count() > 0) {
            return redirect()
                ->back()
                ->with(
                    "message",
                    "Document type is in use and cannot be deleted"
                );
        }

        if ($documentType->delete()) {
            return redirect()
                ->back()
                ->with("message", "Document type deleted successfully");
        } else {
            return redirect()
                ->back()
                ->with("message", "Document type could not be deleted");
        }
    }
}
