<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, softDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ["name", "email", "password", "role"];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = ["password", "remember_token"];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        "email_verified_at" => "datetime",
        "password" => "hashed",
    ];

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, "owner_id", "id");
    }

    public function unreleasedDocuments(): HasMany
    {
        return $this->documents()
            ->whereNull("previous_owner_id")
            ->where("current_owner_id", $this->id)
            ->where("status", "available");
    }

    public function releasedDocuments(): HasMany
    {
        return $this->documents()->whereNotNull("previous_owner_id");
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, "user_id", "id");
    }

    public function unreadNotifications(): HasMany
    {
        return $this->notifications()->where("is_read", false);
    }

    public function incomingBadgeCount(): int
    {
        return DocumentTransfer::query()
            ->with(["receiver"])
            ->whereHas("receiver", function ($query) {
                $query->where("id", "=", $this->id);
            })
            ->whereNot("is_completed", "=", true)
            ->count();
    }

    public function notificationsBadgeCount(): int
    {
        return $this->notifications()
            ->where("is_read", "=", false)
            ->count();
    }

    public function getBadgeCounts()
    {
        return [
            "incoming" => $this->incomingBadgeCount(),
            "notifications" => $this->notificationsBadgeCount(),
        ];
    }
}
