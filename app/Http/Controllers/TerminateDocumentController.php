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

        if ($document->status !== "available") {
            abort(403, "Invalid action.");
        }

        $document->status = "terminal";
        $document->terminated_at = now();

        if (!$document->save()) {
            return back()->with([
                "message" =>
                    "An error occurred while terminating the document.",
            ]);
        }

        return back()->with([
            "message" => "Document {$document->title} ({$document->tracking_code}) has been tagged as terminal and is now listed in the Tagged as Terminal page.",
        ]);
    }

    public function unlock(Document $document)
    {
        $user = auth()->user();
        if ($user->id !== $document->current_owner_id) {
            abort(403, "Unauthorized action.");
        }

        $document->status = "available";
        $document->terminated_at = null;

        if (!$document->save()) {
            return back()->with([
                "message" => "An error occurred while unlocking the document.",
            ]);
        }

        return back()->with([
            "message" => "Document {$document->title} ({$document->tracking_code}) is now unlocked and can be released to other offices.",
        ]);
    }
}
