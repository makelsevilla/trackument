<?php

namespace App\Http\Controllers;

use App\Models\DocumentTransfer;
use Illuminate\Http\Request;

class BadgeController extends Controller
{
    public function getBadgeCounts()
    {
        $user = auth()->user();

        $badgeCounts = ["incoming" => ""];
        $incoming = DocumentTransfer::query()
            ->with(["receiver"])
            ->whereHas("receiver", function ($query) use ($user) {
                $query->where("id", "=", $user->id);
            })
            ->whereNot("is_completed", "=", true)
            ->count();

        $badgeCounts["incoming"] = $incoming;

        return response()->json($badgeCounts);
    }
}
