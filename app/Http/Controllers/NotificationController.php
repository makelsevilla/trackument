<?php

namespace App\Http\Controllers;

use App\Events\UpdateBadgeCounts;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $paginatedNotifications = auth()
            ->user()
            ->notifications()
            ->orderBy("created_at", "desc")
            ->paginate(10);

        return Inertia::render("Notifications", [
            "paginatedNotifications" => $paginatedNotifications,
        ]);
    }

    public function markAsRead(Request $request)
    {
        $request->validate([
            "notificationId" => [
                "required",
                "integer",
                "exists:notifications,id",
            ],
        ]);

        $notification = auth()
            ->user()
            ->notifications()
            ->where("id", $request->notificationId)
            ->first();

        if ($notification) {
            $notification->markAsRead();

            UpdateBadgeCounts::dispatch(auth()->user());
        }

        return back();
    }

    public function markAllAsRead()
    {
        auth()
            ->user()
            ->unreadNotifications()
            ->update(["is_read" => true]);

        UpdateBadgeCounts::dispatch(auth()->user());

        return back();
    }

    public function markAsUnread(Request $request)
    {
        $request->validate([
            "notificationId" => [
                "required",
                "integer",
                "exists:notifications,id",
            ],
        ]);

        $notification = auth()
            ->user()
            ->notifications()
            ->where("id", $request->notificationId)
            ->first();

        if ($notification) {
            $notification->markAsUnread();
        }

        return back();
    }

    public function destroy(Request $request)
    {
        $request->validate([
            "notificationId" => [
                "required",
                "integer",
                "exists:notifications,id",
            ],
        ]);

        $notification = auth()
            ->user()
            ->notifications()
            ->where("id", $request->notificationId)
            ->first();

        if ($notification) {
            $notification->delete();
        }

        UpdateBadgeCounts::dispatch(auth()->user());

        return redirect()
            ->back()
            ->with(["message" => "Notification removed."]);
    }
}
