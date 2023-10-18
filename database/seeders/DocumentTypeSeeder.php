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
        DB::table('document_types')->insert([
            'name' => 'Policy',
            'abbreviation' => 'POL',
            'description' => 'A policy is a deliberate system of principles to guide decisions and achieve rational outcomes. A policy is a statement of intent, and is implemented as a procedure or protocol. Policies are generally adopted by a governance body within an organization.',
            'life_time' => 365,
        ]);

        DB::table('document_types')->insert([
            'name' => 'Procedure',
            'abbreviation' => 'PRO',
            'description' => 'A procedure is a document written to support a "policy directive". A procedure is designed to describe who, what, where, when, and why by means of establishing corporate accountability in support of the implementation of a "policy".',
            'life_time' => 365,
        ]);

        DB::table('document_types')->insert([
            'name' => 'Guideline',
            'abbreviation' => 'GUI',
            'description' => 'A guideline is a statement by which to determine a course of action. A guideline aims to streamline particular processes according to a set routine or sound practice. By definition, following a guideline is never mandatory. Guidelines are not binding and are not enforced.',
            'life_time' => 365,
        ]);

        DB::table('document_types')->insert(
            [
                'name' => 'Unclassified',
                'abbreviation' => 'UNC',
                'description' => 'Unclassified documents are documents that does not apply to the document type selections.',
                'life_time' => 365,
            ]
        );
    }
}
