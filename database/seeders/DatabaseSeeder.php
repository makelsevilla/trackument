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
        \App\Models\User::create([
            "name" => "Test Admin",
            "email" => "admin@example.com",
            "password" =>
                '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            "email_verified_at" => now(),
            "role" => "admin",
        ]);

        \App\Models\User::create([
            "name" => "Test User",
            "email" => "user@example.com",
            "password" =>
                '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            "email_verified_at" => now(),
            "role" => "user",
        ]);

        $this->call([
            DocumentTypeSeeder::class,
            DocumentPurposeSeeder::class,
            DocumentReleaseActionSeeder::class,
        ]);
    }
}
