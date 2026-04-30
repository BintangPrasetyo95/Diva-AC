<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin Diva',
            'email' => 'admin@diva-ac.com',
            'username' => 'admin',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Staff Diva',
            'email' => 'staff@diva-ac.com',
            'username' => 'staff',
            'password' => Hash::make('password'),
            'role' => 'staff',
        ]);
    }
}
