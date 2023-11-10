<?php

namespace App\Http\Controllers;

use App\Models\DocumentTransfer;
use Illuminate\Http\Request;

class BadgeController extends Controller
{
    public function getBadgeCounts()
    {
        $user = auth()->user();

        $badgeCounts = ["incoming" => "", "notifications" => ""];

        $incoming = DocumentTransfer::query()
            ->with(["receiver"])
            ->whereHas("receiver", function ($query) use ($user) {
                $query->where("id", "=", $user->id);
            })
            ->whereNot("is_completed", "=", true)
            ->count();
        if ($incoming > 0) {
            $badgeCounts["incoming"] = $incoming;
        }

        $notifications = $user
            ->notifications()
            ->where("is_read", "=", false)
            ->count();

        if ($notifications > 0) {
            $badgeCounts["notifications"] = $notifications;
        }

        return response()->json($badgeCounts);
    }
}
