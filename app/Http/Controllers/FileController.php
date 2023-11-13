<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function download(DocumentFile $document_file)
    {
        $user = auth()->user();
        $document = Document::find($document_file->document_id);
        if (
            $user->id != $document["owner_id"] &&
            $user->id != $document["current_owner_id"]
        ) {
            abort(403, "You are not authorized to download this file.");
        }

        if (!Storage::exists($document_file->file_path)) {
            abort(404, "File not found.");
        }

        return Storage::download(
            $document_file->file_path,
            $document_file->file_name . "." . $document_file->extension
        );
    }
}
