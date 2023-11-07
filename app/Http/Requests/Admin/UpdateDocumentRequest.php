<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "document_type_id" => "nullable|exists:document_types,id",
            "title" => 'required|regex:/^[a-zA-Z0-9\s]+$/|max:255',
            "description" => "nullable|string",
            "purpose.*" => "nullable|string",
            "related_documents" => "nullable|array",
            "related_documents.*" => [
                "nullable",
                "exists:documents,tracking_code",
            ],
        ];
    }

    public function messages(): array
    {
        return [
            "related_documents.*.exists" => "Document :input does not exist.",
        ];
    }
}
