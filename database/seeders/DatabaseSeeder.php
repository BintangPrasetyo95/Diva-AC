<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            PelangganSeeder::class,
            MekanikSeeder::class,
            SparepartSeeder::class,
            MobilSeeder::class,
            ServiceSeeder::class,
            PenjualanSparepartSeeder::class,
        ]);
    }
}
