<?php

namespace App\Http\Controllers;

use App\Models\DraftDocumentFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\File;

class DraftDocumentFileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        return json_encode(["message" => "Hello World!"]);
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
        /*$inputs = $request->all();
        foreach ($inputs as $key => $value) {
            error_log($key . ': ' . $value);
        }*/
        $user = $request->user();
        $validated = $request->validate([
            'type' => 'required|in:file,link',
            'role' => 'required|in:backup,attachment',
            'fileName' => 'required|string|max:255',
            'documentId' => 'required|exists:draft_documents,id',
            'file' => ['required_if:type,file', File::types(['pdf', 'jpg', 'png', 'docx', 'doc'])->max(10 * 1024)],
            'link' => ['required_if:type,link', 'url']
        ]);

        $file_path = "";
        if ($validated['type'] == 'file') {
            // TODO Save the file to local storage then assign to the $file_path variable to location and filename of the file.

        } else {
            $file_path = $validated['link'];
        }

        $file = new DraftDocumentFile();
        $file['draft_document_id'] = $validated['documentId'];
        $file['file_name'] = $validated['fileName'] ?? "";
        $file['role'] = $validated['role'];
        $file['file_type'] = $validated['type'];
        $file['uploader_id'] = $user->id;
        $file['file_path'] = $file_path;

        if (!$file->save()) {
            return response()->json(["message" => "Error saving to database."], 500);
        }

        return response()->json(["message" => "File added successfully."]);
    }

    /**
     * Display the specified resource.
     */
    public function show(DraftDocumentFile $draftDocumentFile)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DraftDocumentFile $draftDocumentFile)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DraftDocumentFile $draftDocumentFile)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DraftDocumentFile $draftDocumentFile)
    {
        //
    }

    public function saveFile(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:1024',
        ]);

        $file = $request->file('file');
        $file->store('public');

        return json_encode(["message" => "Hello World!"]);
    }

    public function saveLink(Request $request, $document_id)
    {
        $validated = $request->validate([
            'link' => 'required|url',
            'fileName' => 'required|string',
            'role' => 'required|in:backup,attachment'
        ]);

        $file = new DraftDocumentFile();
        $file->draft_document_id = $document_id;
        $file->file_path = $validated['link'];
        $file->file_name = $validated['fileName'];
        $file['role'] = $validated['role'];

        if (!$file->save()) {
            return response()->json(["message" => "Error saving file"], 500);
        }

        return json_encode(["message" => "Hello World!"]);
    }

    public function getDocumentFiles($document_id)
    {
        $files = DB::table('draft_document_files')->where('draft_document_id', $document_id)->get();
        return json_encode($files);
    }

}
