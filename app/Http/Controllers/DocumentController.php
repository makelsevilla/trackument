<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        return Inertia::render('Document/UserDraftDocuments');

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
        $user = auth()->user();
        $document = Document::make([
            'owner_id' => $user->id,
            'current_owner_id' => $user->id,
        ]);
        if (!$document->save()) {
            return back()->with(['message' => "An error occured while creating a document."]);
        }

        return to_route('documents.edit', ['document' => $document->id]);
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
        $user = auth()->user();
        if ($user->id !== $document->owner_id || !$document['is_draft']) {
            abort(403, 'Unauthorized action.');
        }

        $document_types = DB::table('document_types')->select('id', 'name', 'description')->get();
        $document_purposes = DB::table('document_purposes')->get();
        $related_documents = DB::table('related_documents')->where('document_id', $document->id)->select('related_document_code')->get();

        return Inertia::render('Document/EditDraft', [
            'document' => array_merge($document->toArray(), ['related_documents' => $related_documents]),
            'documentTypes' => $document_types,
            'documentPurposes' => $document_purposes,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDocumentRequest $request, Document $document)
    {
        $validated = $request->validated();
        $document->update($validated);

        // handling related documents
        try {

            DB::table('related_documents')->where('document_id', $document->id)->delete();
            if (isset($validated['related_documents'])) {
                foreach ($validated['related_documents'] as $related_document) {
                    DB::table('draft_related_documents')->insert([
                        'document_id' => $document->id,
                        'related_document_code' => $related_document
                    ]);
                }
            }
        } catch (\Exception $e) {
            return back()->with(['message' => "An error occured while saving the related document/s.", 'status' => 'error']);
        }


        return back()->with(['message' => "Document saved successfully.", 'status' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        // if isDraft, force delete
    }
}
