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
        Schema::create('draft_related_documents', function (Blueprint $table) {
            $table->string('related_document_code');
            $table->foreignId('draft_document_id')->constrained('draft_documents')->cascadeOnDelete();
            $table->foreign('related_document_code')->references('tracking_code')->on('documents')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('draft_related_documents');
    }
};
