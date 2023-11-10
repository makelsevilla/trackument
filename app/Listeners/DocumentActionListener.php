<?php

namespace App\Listeners;

use App\Events\NotificationEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class DocumentActionListener
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
        $event->document->histories()->create([
            "action" => $event->action,
            "details" => $event->details,
            "actor_id" => $event->actor->id,
        ]);

        // check if the document notify_owner property is true
        // if true, dispatch NotificationEvent to create a notification
        /*        dd(
            $event->document->notify_owner &&
                $event->document->owner_id !== $event->actor->id
        );*/
        if (
            $event->document->notify_owner &&
            $event->document->owner_id !== $event->actor->id
        ) {
            event(
                new NotificationEvent([
                    "message" => "Document {$event->document->tracking_code} has been {$event->action} by {$event->actor->name}",
                    "user_id" => $event->document->owner_id,
                ])
            );
        }
    }
}
