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
        Schema::create('related_documents', function (Blueprint $table) {
            $table->string('related_document_code');
            $table->foreignId('document_id')->constrained('documents');
            
            $table->foreign('related_document_code')->references('tracking_code')->on('documents');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('related_documents');
    }
};
