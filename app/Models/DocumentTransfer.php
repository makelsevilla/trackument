<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentTransfer extends Model
{
    //    use HasFactory;

    protected $fillable = [
        "receiver_id",
        "received_by",
        "document_id",
        "sender_id",
        "comment",
    ];
    public $timestamps = false;
}
