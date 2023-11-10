<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $paginatedNotifications = auth()
            ->user()
            ->notifications()
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
        }

        return redirect()->back();
    }

    public function markAllAsRead()
    {
        auth()
            ->user()
            ->unreadNotifications()
            ->update(["is_read" => true]);

        return redirect()->back();
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

        return redirect()->back();
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

        return redirect()
            ->back()
            ->with(["message" => "Notification removed."]);
    }
}
