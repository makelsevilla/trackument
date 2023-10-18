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
        Schema::create('document_files', function (Blueprint $table) {
            $table->id();
            $table->string('file_name');
            $table->string('file_type')->comment('backup or attachment');
            $table->string('file_path');
            $table->dateTime('uploaded_at')->useCurrent();

            $table->foreignId('uploader_id')->constrained('users');
            $table->foreignId('document_id')->constrained('documents')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_files');
    }
};
