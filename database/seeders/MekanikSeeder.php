<?php

namespace Database\Seeders;

use App\Models\Mekanik;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MekanikSeeder extends Seeder
{
    public function run(): void
    {
        Mekanik::create([
            'nama_mekanik' => 'Agus Mekanik',
            'jenis_kelamin' => 'L',
            'no_telp' => '08211223344',
            'level_mekanik' => 'senior',
            'alamat' => 'Jl. Bengkel No. 10',
            'username' => 'agus_mekanik',
            'password' => Hash::make('password'),
            'aktif' => true,
        ]);

        Mekanik::create([
            'nama_mekanik' => 'Doni Junior',
            'jenis_kelamin' => 'L',
            'no_telp' => '08556677889',
            'level_mekanik' => 'junior',
            'alamat' => 'Jl. Pemuda No. 2',
            'username' => 'doni_j',
            'password' => Hash::make('password'),
            'aktif' => true,
        ]);
    }
}
