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
            "name" => "MIS Office",
            "username" => "mis_office",
            "password" =>
                '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            "role" => "admin",
        ]);

        \App\Models\User::create([
            "name" => "Accounting Office",
            "username" => "accounting_office",
            "password" =>
                '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            "role" => "user",
        ]);

        \App\Models\User::create([
            "name" => "Private Individual",
            "username" => "private_individual",
            "password" =>
                '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            "role" => "user",
        ]);

        $this->call([
            DocumentTypeSeeder::class,
            DocumentPurposeSeeder::class,
            DocumentReleaseActionSeeder::class,
        ]);
    }
}
