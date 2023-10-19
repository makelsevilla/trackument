<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DraftDocument extends Model
{
//    use HasFactory;

    protected $fillable = [
        'title',
        'purpose',
        'description',
    ];

    protected $casts = [
        'purpose' => 'array',
    ];
}
