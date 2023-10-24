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
    public function index(Request $request)
    {
        $document_id = $request->query('document_id');
        $role = $request->query('role');

        $document_files = DB::table('draft_document_files')->join('users', 'draft_document_files.uploader_id', '=', 'users.id')->where('draft_document_files.draft_document_id', '=', $document_id)->where('draft_document_files.role', '=', $role)->select('draft_document_files.*', 'users.name as uploader_name')->get();
        return response()->json($document_files);
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
            $file_path = $request->file('file')->store('documents/files/');

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
     * Remove the specified resource from storage.
     */
    public function destroy($draftDocumentFile)
    {
        DB::table('draft_document_files')->where('id', '=', $draftDocumentFile)->delete();
        return response()->json(["message" => "File deleted successfully."]);
    }
}
