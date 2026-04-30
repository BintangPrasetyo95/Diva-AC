<?php

namespace Database\Seeders;

use App\Models\Mobil;
use App\Models\Pelanggan;
use Illuminate\Database\Seeder;

class MobilSeeder extends Seeder
{
    public function run(): void
    {
        $pelanggan1 = Pelanggan::first();
        $pelanggan2 = Pelanggan::skip(1)->first();

        Mobil::create([
            'id_pelanggan' => $pelanggan1->id,
            'merk' => 'Toyota',
            'model' => 'Avanza',
            'tahun' => 2020,
            'no_polisi' => 'B 1234 ABC',
            'warna' => 'Hitam',
        ]);

        Mobil::create([
            'id_pelanggan' => $pelanggan2->id,
            'merk' => 'Honda',
            'model' => 'Civic',
            'tahun' => 2022,
            'no_polisi' => 'D 5678 XYZ',
            'warna' => 'Putih',
        ]);
    }
}
