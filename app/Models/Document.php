<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Document extends Model
{
    use HasFactory, softDeletes;

    protected $fillable = [
        "document_type_id",
        "title",
        "description",
        "purpose",
        "owner_id",
        "current_owner_id",
        "document_type_id",
    ];

    protected $casts = [
        "purpose" => "array",
    ];

    public function transfers(): HasMany
    {
        return $this->hasMany(DocumentTransfer::class, "document_id", "id");
    }

    public function latestTransfer(): HasOne
    {
        return $this->transfers()
            ->one()
            ->ofMany("completed_at", "max");
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(DocumentType::class, "document_type_id", "id");
    }
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, "owner_id", "id");
    }

    public function currentOwner(): BelongsTo
    {
        return $this->belongsTo(User::class, "current_owner_id", "id");
    }

    public function previousOwner(): BelongsTo
    {
        return $this->belongsTo(User::class, "previous_owner_id", "id");
    }

    public function histories(): HasMany
    {
        return $this->hasMany(DocumentHistory::class, "document_id", "id");
    }

    public function generateTrackingCode($doc_type_abbr = "NO-TYPE"): string
    {
        return $doc_type_abbr . "-" . $this->id . "-" . $this->owner_id;
    }

    public function deleteRelatedDocuments(): void
    {
        DB::table("related_documents")
            ->where("document_id", $this->id)
            ->delete();
    }

    public function saveRelatedDocuments($document_id, $related_documents)
    {
        try {
            $this->deleteRelatedDocuments();

            if (count($related_documents)) {
                foreach ($related_documents as $related_document) {
                    $success = DB::table("related_documents")->insert([
                        "document_id" => $document_id,
                        "related_document_code" => $related_document,
                    ]);

                    if (!$success) {
                        return back()->with([
                            "message" =>
                                "An error occured while saving the related document/s.",
                            "status" => "error",
                        ]);
                    }
                }
            }
        } catch (\Exception $e) {
            return back()->with([
                "message" =>
                    "An error occured while saving the related document/s.",
                "status" => "error",
            ]);
        }
    }

    public function hasFiles(): bool
    {
        return DB::table("document_files")
            ->where("document_id", $this->id)
            ->exists();
    }

    public function deleteFiles(): void
    {
        // check if the document has files
        if ($this->hasFiles()) {
            DB::table("document_files")
                ->where("document_id", $this->id)
                ->delete();
        }
    }

    public function getOwner(string $owner_type)
    {
        $query = DB::table("users");

        switch ($owner_type) {
            case "owner":
                $query = $query->where("id", "=", $this->owner_id);
                break;

            case "current":
                $query = $query->where("id", "=", $this->current_owner_id);

                break;

            case "previous":
                $query = $query->where("id", "=", $this->previous_owner_id);
                break;
        }

        return $query;
    }
}
