<?php

namespace Database\Seeders;

use App\Models\Pelanggan;
use Illuminate\Database\Seeder;

class PelangganSeeder extends Seeder
{
    public function run(): void
    {
        Pelanggan::create([
            'nama_pelanggan' => 'Budi Santoso',
            'no_telp' => '081234567890',
            'email' => 'budi@example.com',
            'jenis_kelamin' => 'L',
            'alamat' => 'Jl. Merdeka No. 1, Jakarta',
            'tanggal_daftar' => now(),
        ]);

        Pelanggan::create([
            'nama_pelanggan' => 'Siti Aminah',
            'no_telp' => '089876543210',
            'email' => 'siti@example.com',
            'jenis_kelamin' => 'P',
            'alamat' => 'Jl. Melati No. 5, Bandung',
            'tanggal_daftar' => now(),
        ]);
    }
}
