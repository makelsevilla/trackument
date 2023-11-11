<?php

namespace App\Listeners;

use App\Events\DocumentTransferEvent;
use App\Events\TransferReceiverEvent;
use App\Events\UpdateBadgeCounts;
use App\Events\UserTransferEvent;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class DocumentTransferListener
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
    public function handle(DocumentTransferEvent $event): void
    {
        switch ($event->action) {
            case "accept":
            case "reject":
                UserTransferEvent::dispatch($event->transfer->sender_id);
                break;
            case "release":
            case "cancel":
                UserTransferEvent::dispatch($event->transfer->receiver_id);
                break;
            default:
                break;
        }

        UpdateBadgeCounts::dispatch(User::find($event->transfer->sender_id));
        UpdateBadgeCounts::dispatch(User::find($event->transfer->receiver_id));
    }
}
