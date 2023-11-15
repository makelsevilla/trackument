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
        $users = [
            [
                "name" => "SB Office",
                "username" => "sb-office",
            ],
            [
                "name" => "Admin Office",
                "username" => "admin-office",
            ],
            [
                "name" => "Accounting Office",
                "username" => "accounting-office",
            ],
            [
                "name" => "Mayor Office",
                "username" => "mayor-office",
            ],
            [
                "name" => "Treasurer Office",
                "username" => "treasurer-office",
            ],
        ];

        \App\Models\User::create([
            "name" => "System Admin",
            "username" => "admin",
            "password" =>
                '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            "role" => "admin",
        ]);

        foreach ($users as $user) {
            \App\Models\User::create([
                "name" => $user["name"],
                "username" => $user["username"],
                "password" =>
                    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
                "role" => "user",
            ]);
        }

        $this->call([
            DocumentTypeSeeder::class,
            DocumentPurposeSeeder::class,
            DocumentReleaseActionSeeder::class,
        ]);
    }
}
