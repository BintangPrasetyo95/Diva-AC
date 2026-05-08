<?php

namespace Database\Seeders;

use App\Models\Sparepart;
use Illuminate\Database\Seeder;

class SparepartSeeder extends Seeder
{
    public function run(): void
    {
        Sparepart::create([
            'nama_sparepart' => 'Kompresor AC Sanden 508',
            'tipe_sparepart' => 'Kompresor',
            'harga_sparepart' => 1500000,
            'stock_sparepart' => 10,
            'image' => '/img/spareparts/sp1.png',
            'keterangan' => 'Kompresor AC universal berkualitas tinggi.',
        ]);

        Sparepart::create([
            'nama_sparepart' => 'Filter Udara Toyota Avanza',
            'tipe_sparepart' => 'Filter',
            'harga_sparepart' => 125000,
            'stock_sparepart' => 25,
            'image' => '/img/spareparts/sp2.png',
            'keterangan' => 'Filter udara asli untuk performa mesin optimal.',
        ]);

        Sparepart::create([
            'nama_sparepart' => 'Kampas Rem Depan Honda Civic',
            'tipe_sparepart' => 'Rem',
            'harga_sparepart' => 450000,
            'stock_sparepart' => 15,
            'image' => '/img/spareparts/sp3.png',
            'keterangan' => 'Kampas rem berkualitas tinggi untuk pengereman aman.',
        ]);
    }
}
