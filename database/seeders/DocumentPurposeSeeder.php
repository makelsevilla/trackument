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
        DB::table('document_purposes')->insert([
            'purpose' => 'for your information'
        ]);

        DB::table('document_purposes')->insert([
            'purpose' => 'for compliance'
        ]);

        DB::table('document_purposes')->insert([
            'purpose' => 'for reference'
        ]);

        DB::table('document_purposes')->insert([
            'purpose' => 'for action'
        ]);

        DB::table('document_purposes')->insert([
            'purpose' => 'for approval'
        ]);
    }
}
