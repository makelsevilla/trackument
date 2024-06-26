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
        Schema::create("document_transfers", function (Blueprint $table) {
            $table->id();
            $table
                ->string("status")
                ->default("pending")
                ->comment("pending, completed, rejected");
            $table->string("receiver_name")->nullable();
            $table->string("comment")->nullable();
            $table->boolean("is_completed")->default(false);
            $table->dateTime("transferred_at")->useCurrent();
            $table->dateTime("completed_at")->nullable();

            $table
                ->foreignId("document_id")
                ->constrained("documents")
                ->onDelete("cascade");
            $table->foreignId("sender_id")->constrained("users");
            $table
                ->foreignId("receiver_id")
                ->nullable()
                ->constrained("users");
            $table->string("release_action");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("document_transfers");
    }
};
