<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    //    use HasFactory;
    public $fillable = ["message", "is_read", "user_id"];
    public $timestamps = false;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    public function markAsRead()
    {
        $this->is_read = true;
        $this->save();
    }

    public function markAsUnread()
    {
        $this->is_read = false;
        $this->save();
    }
}
