<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DocumentReleaseActionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $actions = ["approved", "disapproved", "endorse", "return to sender"];

        foreach ($actions as $action) {
            DB::table("document_release_actions")->insert([
                "action_name" => $action,
            ]);
        }
    }
}
