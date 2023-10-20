<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DraftDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DraftDocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = auth()->user();
        $document = DraftDocument::make();
        $document->owner_id = $user->id;
        if (!$document->save()) {
            return back()->with(['message' => "An error occured while creating a document."]);
        }

        return to_route('documents.edit', ['document' => $document->id]);
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
    public function show(DraftDocument $document)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DraftDocument $document)
    {
        $user = auth()->user();
        if ($user->id !== $document->owner_id) {
            abort(403, 'Unauthorized action.');
        }

        $document_types = DB::table('document_types')->select('id', 'name', 'description')->get();
        $document_purposes = DB::table('document_purposes')->get();

        return Inertia::render('EditDraft', [
            'draftDocument' => $document,
            'documentTypes' => $document_types,
            'documentPurposes' => $document_purposes,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DraftDocument $document)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DraftDocument $document)
    {
        //
    }
}
