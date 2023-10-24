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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default('Untitled Document');
            $table->json('purpose')->nullable();
            $table->text('description')->nullable();
            $table->string('status')->default('unavailable')->comment("available, unavailable, archived"); // available means it is available for transfer, archived means that it is tagged as terminal
            $table->string('tracking_code')->unique()->nullable();
            $table->boolean('is_draft')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->foreignId('owner_id')->constrained('users');
            $table->foreignId('current_owner_id')->constrained('users');
            $table->foreignId('previous_owner_id')->nullable()->constrained('users');
            $table->foreignId('document_type_id')->nullable()->constrained('document_types');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
