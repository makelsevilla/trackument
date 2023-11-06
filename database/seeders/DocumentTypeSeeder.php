<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DocumentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $documentTypes = [
            [
                "name" => "certificate of service",
                "abbreviation" => "COS",
                "description" => "",
                "life_time" => 365,
            ],
            [
                "name" => "disbursement voucher",
                "abbreviation" => "DV",
                "description" => "",
                "life_time" => 365,
            ],
            [
                "name" => "inventory and inspection report",
                "abbreviation" => "IIR",
                "description" => "",
                "life_time" => 365,
            ],
            [
                "name" => "letter",
                "abbreviation" => "LET",
                "description" => "",
                "life_time" => 365,
            ],
            [
                "name" => "liquidation report",
                "abbreviation" => "LR",
                "description" => "",
                "life_time" => 365,
            ],
            [
                "name" => "memorandum",
                "abbreviation" => "MEM",
                "description" => "",
                "life_time" => 365,
            ],
            [
                "name" => "memorandum of agreement",
                "abbreviation" => "MOA",
                "description" => "",
                "life_time" => 365,
            ],
            [
                "name" => "unclassified",
                "abbreviation" => "UNC",
                "description" => "",
                "life_time" => 365,
            ],
        ];

        foreach ($documentTypes as $type) {
            DB::table("document_types")->insert($type);
        }
    }
}
