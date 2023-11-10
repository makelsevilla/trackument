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
        Schema::table("documents", function (Blueprint $table) {
            $table
                ->boolean("notify_owner")
                ->after("document_type_id")
                ->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("documents", function (Blueprint $table) {
            $table->dropColumn("notify_owner");
        });
    }
};
