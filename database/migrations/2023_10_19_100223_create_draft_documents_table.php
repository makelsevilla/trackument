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
        Schema::create('draft_documents', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default('Untitled Document');
            $table->json('purpose')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('document_type_id')->nullable()->constrained('document_types')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('draft_documents');
    }
};
