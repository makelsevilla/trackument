<?php

namespace Database\Seeders;

use App\Models\DocumentType;
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
                "description" =>
                    "the certificate of service is a document that is filed with the court to prove that a copy of the document was served on the other party. It is a document that is signed by the person who served the document and states the date and manner of service.",
            ],
            [
                "name" => "disbursement voucher",
                "abbreviation" => "DV",
                "description" => "",
            ],
            [
                "name" => "inventory and inspection report",
                "abbreviation" => "IIR",
                "description" => "",
            ],
            [
                "name" => "letter",
                "abbreviation" => "LET",
                "description" => "",
            ],
            [
                "name" => "liquidation report",
                "abbreviation" => "LR",
                "description" => "",
            ],
            [
                "name" => "memorandum",
                "abbreviation" => "MEM",
                "description" => "",
            ],
            [
                "name" => "memorandum of agreement",
                "abbreviation" => "MOA",
                "description" => "",
            ],
            [
                "name" => "unclassified",
                "abbreviation" => "UNC",
                "description" => "",
            ],
        ];

        foreach ($documentTypes as $type) {
            DocumentType::create($type);
        }
    }
}
