<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->json('purpose');
            $table->text('description')->nullable();
            $table->string('status')->default('draft')->comment("draft, available, archived");
            $table->string('tracking_code');
            $table->timestamps();
            $table->softDeletes();

            $table->foreignId('author_id')->constrained('users');
            $table->foreignId('current_owner_id')->default(function () {
                return auth()->user()->id;
            })->constrained('users');
            $table->foreignId('previous_owner_id')->nullable()->constrained('users');
            $table->foreignId('document_type_id')->constrained('document_types');
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
