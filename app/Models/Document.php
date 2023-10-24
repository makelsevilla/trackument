<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory, softDeletes;

    protected $fillable = [
        'title',
        'purpose',
        'description',
    ];

    protected $casts = [
        'purpose' => 'array',
    ];
}
