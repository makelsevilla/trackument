<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('draft_document_files', function (Blueprint $table) {
            $table->id();
            $table->string('file_type')->comment("file or link");
            $table->string("file_name");
            $table->string('file_path');
            $table->string("role")->comment("attachment or backup");
            $table->dateTime('uploaded_at')->useCurrent();
            $table->foreignId('uploader_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('draft_document_id')->constrained('draft_documents')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('draft_document_files');
    }
};
