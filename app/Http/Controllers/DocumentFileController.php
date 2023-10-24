<?php

namespace App\Http\Controllers;

use App\Models\DocumentFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\File;

class DocumentFileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $document_id = $request->query('document_id');
        $role = $request->query('role');

        $document_files = DB::table('document_files')->join('users', 'document_files.uploader_id', '=', 'users.id')->where('document_files.document_id', '=', $document_id)->where('document_files.role', '=', $role)->select('document_files.*', 'users.name as uploader_name')->get();
        return response()->json($document_files);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'type' => 'required|in:file,link',
            'role' => 'required|in:backup,attachment',
            'fileName' => 'required|string|max:255',
            'documentId' => 'required|exists:documents,id',
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

        $file = new DocumentFile();
        $file['document_id'] = $validated['documentId'];
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
    public function destroy(DocumentFile $document_file)
    {
        if (!$document_file->delete()) {
            return response()->json(["message" => "Error deleting file."], 500);
        }

        // determine if the file is a link or a file
        // if a file, delete the file from storage
        if ($document_file['file_type'] == 'file') {
            if (!Storage::delete($document_file['file_path'])) {
                return response()->json(["message" => "Error deleting file."], 500);
            }
        }
        return response()->json(["message" => "File deleted successfully."]);
    }
}
