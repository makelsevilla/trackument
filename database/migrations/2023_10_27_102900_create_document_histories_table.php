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
        Schema::create("document_histories", function (Blueprint $table) {
            $table->id();
            $table->string("action");
            $table->string("action_detail");
            $table->dateTime("action_date");

            $table
                ->foreignId("document_id")
                ->constrained("documents")
                ->cascadeOnDelete();
            $table->foreignId("actor_id")->constrained("users");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("document_histories");
    }
};
