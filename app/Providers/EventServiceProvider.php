<?php

namespace App\Providers;

use App\Events\DocumentActionEvent;
use App\Events\DocumentTransferEvent;
use App\Events\NotificationEvent;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [SendEmailVerificationNotification::class],
        DocumentActionEvent::class => [
            \App\Listeners\DocumentActionListener::class,
        ],
        NotificationEvent::class => [
            \App\Listeners\NotificationEventListener::class,
        ],
        DocumentTransferEvent::class => [
            \App\Listeners\DocumentTransferListener::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
