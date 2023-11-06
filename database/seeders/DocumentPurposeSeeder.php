<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DocumentPurposeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $purposes = [
            "for your information",
            "follow-up",
            "endorsement/recommendation",
            "draft of reply",
            "dissemination of information",
            "compliance/implementation",
            "appropriate action",
            "coding/deposit/preparation of receipt",
        ];

        foreach ($purposes as $purpose) {
            DB::table("document_purposes")->insert([
                "purpose" => $purpose,
            ]);
        }
    }
}
