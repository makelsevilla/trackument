<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UpdateDocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(Request $request): bool
    {
        // get the implicitly bind document model from route
        $document = $request->route('document');
        
        return $document && $this->user()->id == $document->owner_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'document_type_id' => 'nullable|exists:document_types,id',
            'title' => 'required|regex:/^[a-zA-Z0-9\s]+$/|max:255',
            'description' => 'nullable|string',
            'purpose.*' => 'nullable|string',
            'related_documents.*' => ['nullable', 'exists:documents,tracking_code']
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'related_documents.*.exists' => 'Document :input does not exist.'
        ];
    }
}
