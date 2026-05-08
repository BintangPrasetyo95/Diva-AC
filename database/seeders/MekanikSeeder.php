<?php

namespace Database\Seeders;

use App\Models\Mekanik;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MekanikSeeder extends Seeder
{
    public function run(): void
    {
        $user1 = User::create([
            'name' => 'Agus Mekanik',
            'jenis_kelamin' => 'L',
            'no_telp' => '08211223344',
            'alamat' => 'Jl. Bengkel No. 10',
            'username' => 'agus_mekanik',
            'password' => Hash::make('password'),
            'role' => 'mekanik',
        ]);
        $user1->mekanik()->create([
            'level_mekanik' => 'senior',
            'aktif' => true,
        ]);

        $user2 = User::create([
            'name' => 'Doni Junior',
            'jenis_kelamin' => 'L',
            'no_telp' => '08556677889',
            'alamat' => 'Jl. Pemuda No. 2',
            'username' => 'doni_j',
            'password' => Hash::make('password'),
            'role' => 'mekanik',
        ]);
        $user2->mekanik()->create([
            'level_mekanik' => 'junior',
            'aktif' => true,
        ]);
    }
}
