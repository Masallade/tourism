<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::updateOrCreate(
            ['email' => 'admin@unison-tour.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Create demo user
        User::updateOrCreate(
            ['email' => 'test@unison-tour.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('test123'),
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );
    }
}



