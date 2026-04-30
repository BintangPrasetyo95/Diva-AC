<?php

namespace Database\Seeders;

use App\Models\Sparepart;
use Illuminate\Database\Seeder;

class SparepartSeeder extends Seeder
{
    public function run(): void
    {
        Sparepart::create([
            'nama_sparepart' => 'Oli Mesin Shell 4L',
            'tipe_sparepart' => 'Oli',
            'harga_sparepart' => 450000,
            'stock_sparepart' => 20,
        ]);

        Sparepart::create([
            'nama_sparepart' => 'Filter Udara Toyota Avanza',
            'tipe_sparepart' => 'Filter',
            'harga_sparepart' => 125000,
            'stock_sparepart' => 15,
        ]);

        Sparepart::create([
            'nama_sparepart' => 'Kampas Rem Depan',
            'tipe_sparepart' => 'Rem',
            'harga_sparepart' => 350000,
            'stock_sparepart' => 10,
        ]);
    }
}
