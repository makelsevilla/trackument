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
            $table->string("details");
            $table->timestamps();

            $table
                ->foreignId("document_id")
                ->constrained("documents")
                ->onDelete("cascade");
            $table
                ->foreignId("actor_id")
                ->constrained("users")
                ->onDelete("cascade");
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
