<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Document extends Model
{
    use HasFactory, softDeletes;

    protected $fillable = [
        'document_type_id',
        'title',
        'description',
        'purpose',
        'owner_id',
        'current_owner_id',
        'document_type_id'
    ];

    protected $casts = [
        'purpose' => 'array',
    ];

    public function generateTrackingCode($doc_type_abbr = "NO-TYPE"): string
    {

        return $doc_type_abbr . "-" . $this->id . "-" . $this->owner_id;
    }

    public function saveRelatedDocuments($document_id, $related_documents)
    {
        try {
            DB::table('related_documents')->where('document_id', $document_id)->delete();
            if (count($related_documents)) {

                foreach ($related_documents as $related_document) {
                    $success = DB::table('related_documents')->insert([
                        'document_id' => $document_id,
                        'related_document_code' => $related_document
                    ]);

                    if (!$success) {
                        return back()->with(['message' => "An error occured while saving the related document/s.", 'status' => 'error']);
                    }
                }
            }

        } catch (\Exception $e) {
            return back()->with(['message' => "An error occured while saving the related document/s.", 'status' => 'error']);
        }
    }
}
