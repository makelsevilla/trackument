<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentTransfer extends Model
{
    //    use HasFactory;
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, "sender_id")->withTrashed();
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, "receiver_id")->withTrashed();
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    protected $fillable = [
        "receiver_id",
        "receiver_name",
        "document_id",
        "sender_id",
        "comment",
        "transferred_at",
        "release_action",
    ];
    public $timestamps = false;
}
