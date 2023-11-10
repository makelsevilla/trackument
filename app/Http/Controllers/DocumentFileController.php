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
        $document_id = $request->query("document_id");

        $document_files = DB::table("document_files")
            ->join("users", "document_files.uploader_id", "=", "users.id")
            ->where("document_files.document_id", "=", $document_id)
            ->select("document_files.*", "users.name as uploader_name")
            ->orderBy("document_files.uploaded_at", "desc")
            ->get();

        return response()->json($document_files);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            "type" => "required|in:file,link",
            "role" => "required|in:backup,attachment",
            "fileName" =>
                "required|string|max:255|unique:document_files,file_name",
            "documentId" => "required|exists:documents,id",
            "file" => [
                "required_if:type,file",
                File::types(["pdf", "jpg", "png", "docx", "doc"])->max(
                    10 * 1024
                ),
            ],
            "link" => ["required_if:type,link", "url"],
        ]);

        $file_path = "";
        if ($validated["type"] == "file") {
            $file_path = $request->file("file")->store("documents/files/");
        } else {
            $file_path = $validated["link"];
        }

        $file = new DocumentFile();
        $file["document_id"] = $validated["documentId"];
        $file["file_name"] = $validated["fileName"] ?? "";
        $file["role"] = $validated["role"];
        $file["file_type"] = $validated["type"];
        $file["uploader_id"] = $user->id;
        $file["file_path"] = $file_path;

        if (!$file->save()) {
            return response()->json(
                ["message" => "Error saving the file."],
                500
            );
        }

        return response()->json([
            "message" => "{$validated["fileName"]} file added successfully.",
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DocumentFile $document_file)
    {
        // Ensure the file_type and file_path are available
        if ($document_file->file_type === "file" && $document_file->file_path) {
            // Attempt to delete the file from storage
            if (Storage::delete($document_file->file_path)) {
                // File deleted successfully, continue with record deletion
                $document_file->delete();
                return response()->json([
                    "message" => "{$document_file->file_name} file deleted successfully",
                ]);
            } else {
                // Error deleting the file
                return response()->json(
                    [
                        "message" => "Error deleting {$document_file->file_name} file.",
                    ],
                    500
                );
            }
        } else {
            // If the file type is not 'file' or file_path is missing, just delete the record
            if ($document_file->delete()) {
                return response()->json([
                    "message" => "{$document_file->file_name} file link deleted successfully",
                ]);
            } else {
                return response()->json(
                    [
                        "message" => "Error deleting {$document_file->file_name} file link.",
                    ],
                    500
                );
            }
        }
    }
}
