<?php

namespace App\Http\Middleware;

use App\Models\DocumentTransfer;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = "app";

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            "auth" => [
                "user" => $request->user(),
            ],
            "ziggy" => fn() => [
                ...(new Ziggy())->toArray(),
                "location" => $request->url(),
            ],
            "flash" => [
                "status" => fn() => $request->session()->get("status"),
                "message" => fn() => $request->session()->get("message"),
            ],
            "badgeCounts" => fn() => [
                "incoming" => fn() => DocumentTransfer::query()
                    ->with(["receiver"])
                    ->whereHas("receiver", function ($query) use ($user) {
                        $query->where("id", "=", $user->id);
                    })
                    ->whereNot("is_completed", "=", true)
                    ->count(),
                "notifications" => fn() => $user
                    ->notifications()
                    ->where("is_read", "=", false)
                    ->count(),
            ],
        ];
    }
}
