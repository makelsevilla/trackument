<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentTransfer extends Model
{
    //    use HasFactory;

    protected $fillable = [
        "receiver_id",
        "receiver_name",
        "document_id",
        "sender_id",
    ];
    public $timestamps = false;
}
