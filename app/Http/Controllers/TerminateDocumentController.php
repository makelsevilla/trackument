<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;

class TerminateDocumentController extends Controller
{
    public function terminate(Document $document)
    {
        // set the status of the document to terminal
        $user = auth()->user();
        if ($user->id !== $document->current_owner_id) {
            abort(403, "Unauthorized action.");
        }

        $document->status = "terminal";

        if (!$document->save()) {
            return back()->with([
                "message" => "An error occured while terminating the document.",
            ]);
        }

        return back()->with([
            "message" => "Document terminated.",
        ]);
    }

    public function unlock(Document $document)
    {
        $user = auth()->user();
        if ($user->id !== $document->current_owner_id) {
            abort(403, "Unauthorized action.");
        }

        $document->status = "available";

        if (!$document->save()) {
            return back()->with([
                "message" => "An error occured while unlocking the document.",
            ]);
        }

        return back()->with([
            "message" => "Document unlocked.",
        ]);
    }
}
