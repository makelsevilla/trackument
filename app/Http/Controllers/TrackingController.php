<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TrackingController extends Controller
{
    public function track()
    {
    }

    public function history(Request $request, $tracking_code)
    {
        $user = auth()->user();
        $document = Document::where("tracking_code", $tracking_code)->first();

        $documentHistory = null;
        if ($document) {
            if ($document->owner_id !== $user->id) {
                abort(403, "Unauthorized Access.");
            }

            $documentHistory = DB::table("document_histories as dh")
                ->join("users as actor", "dh.actor_id", "=", "actor.id")
                ->where("document_id", $document->id)
                ->select("dh.*", "actor.name as actor_name")
                ->orderBy("dh.created_at", "desc")
                ->get();
        }

        return Inertia::render("Document/DocumentHistory", [
            "documentHistory" => $documentHistory,
            "trackingCode" => $tracking_code,
        ]);
    }
}
