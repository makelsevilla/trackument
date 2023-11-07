<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentType extends Model
{
    use HasFactory;

    protected $fillable = ["name", "abbreviation", "description"];

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, "document_type_id", "id");
    }
}
