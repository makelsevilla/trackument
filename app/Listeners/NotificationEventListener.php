<?php

namespace App\Listeners;

use App\Events\UpdateBadgeCounts;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NotificationEventListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(object $event): void
    {
        $notification = Notification::create([...$event->data]);

        if ($notification) {
            UpdateBadgeCounts::dispatch(User::find($event->data["user_id"]));
        }
    }
}
