<?php

namespace Database\Seeders;

use App\Models\PenjualanSparepart;
use App\Models\User;
use App\Models\Sparepart;
use Illuminate\Database\Seeder;

class PenjualanSparepartSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('role', 'staff')->first();
        $sparepart = Sparepart::where('nama_sparepart', 'Filter Udara Toyota Avanza')->first();

        $penjualan = PenjualanSparepart::create([
            'id_user' => $user->id,
            'tanggal_penjualan' => now(),
            'total_harga' => 125000,
            'bayar' => 150000,
            'kembali' => 25000,
        ]);

        $penjualan->spareparts()->attach($sparepart->id, [
            'jumlah' => 1,
            'harga_satuan' => $sparepart->harga_sparepart,
        ]);
    }
}
