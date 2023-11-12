<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DocumentTransferRequest extends FormRequest
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
            "receiver_id" => "nullable|exists:users,id",
            "receiver_name" =>
                "required_if:receiver_id,null|nullable|string|max:255",
            "release_action" =>
                "required|exists:document_release_actions,action_name",
            "comment" => "nullable|string|max:255",
        ];
    }

    public function messages(): array
    {
        return [
            "receiver_name.required_if" =>
                "The individual name field is required when releasing to an individual.",
        ];
    }
}
