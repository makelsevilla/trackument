<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class FinalizeDocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(Request $request): bool
    {
        $user = $this->user();
        // get the implicitly bind document model from route
        $document = $request->route('document');

        return $document->owner_id === $user->id && $document->current_owner_id === $user->id && $document->status !== 'terminal';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'document_type_id' => 'required|exists:document_types,id',
            'title' => 'required|regex:/^[a-zA-Z0-9\s]+$/|max:255',
            'description' => 'nullable|string',
            'purpose' => 'required|array',
            'purpose.*' => 'nullable|string',
            'related_documents' => 'nullable|array',
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
