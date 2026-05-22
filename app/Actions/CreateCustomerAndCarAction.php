<?php

namespace App\Actions;

use App\Models\Pelanggan;
use App\Models\Mobil;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class CreateCustomerAndCarAction
{
    /**
     * Creates a new customer (Pelanggan) and a new car (Mobil) associated with them.
     *
     * @param array $data The validated data containing customer and car details.
     * @return Mobil The newly created car instance.
     */
    public function execute(array $data): Mobil
    {
        return DB::transaction(function () use ($data) {
            $user = Pelanggan::create([
                'name' => $data['nama_pelanggan'],
                'username' => strtolower(str_replace(' ', '', $data['nama_pelanggan'])) . rand(100, 999),
                'email' => $data['email'] ?? null,
                'no_telp' => $data['no_telp'],
                'alamat' => $data['alamat'] ?? null,
                'jenis_kelamin' => $data['jenis_kelamin'] ?? null,
                'role' => 'customer',
                'password' => Hash::make('password123'),
                'tanggal_daftar' => now(),
            ]);

            return Mobil::create([
                'id_pelanggan' => $user->id,
                'merk' => $data['merk'],
                'model' => $data['model'],
                'no_polisi' => $data['no_polisi'],
                'tahun' => $data['tahun'] ?? null,
                'warna' => $data['warna'] ?? null,
            ]);
        });
    }
}
