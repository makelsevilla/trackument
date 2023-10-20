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

        return Inertia::render('UserDraftDocuments');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        $draftDocument = DraftDocument::make();
        $draftDocument->owner_id = $user->id;
        if (!$draftDocument->save()) {
            return back()->with(['message' => "An error occured while creating a document."]);
        }

        return to_route('draft.documents.edit', ['document' => $draftDocument->id]);
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
        $related_documents = DB::table('draft_related_documents')->where('draft_document_id', $document->id)->select('related_document_code')->get();
        dd($related_documents);

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
