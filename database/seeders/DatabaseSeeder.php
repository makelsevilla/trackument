<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\User::factory(5)->create();

        \App\Models\User::factory()->create([
            "name" => "Test Admin",
            "email" => "admin@example.com",
            "role" => "admin",
        ]);

        \App\Models\User::factory()->create([
            "name" => "Test User",
            "email" => "user@example.com",
            "role" => "user",
        ]);

        $this->call([
            DocumentTypeSeeder::class,
            DocumentPurposeSeeder::class,
            DocumentReleaseActionSeeder::class,
        ]);
    }
}
