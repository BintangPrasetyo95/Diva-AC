<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\Mobil;
use App\Models\Mekanik;
use App\Models\Sparepart;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $mobil = Mobil::first();
        $mekanik = Mekanik::first();
        $sparepart = Sparepart::first();

        $service = Service::create([
            'id_mobil' => $mobil->id,
            'id_mekanik' => $mekanik->id,
            'tanggal_service' => now(),
            'tipe_service' => 'Ganti Oli',
            'harga_service' => 100000,
            'total_service' => 550000,
            'bayar_service' => 600000,
            'kembali_service' => 50000,
            'status_service' => 'selesai',
            'catatan' => 'Ganti oli rutin',
        ]);

        $service->spareparts()->attach($sparepart->id, [
            'jumlah' => 1,
            'harga_satuan' => $sparepart->harga_sparepart,
        ]);
    }
}
