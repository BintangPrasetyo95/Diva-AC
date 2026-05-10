<?php

namespace Database\Seeders;

use App\Models\StoreSetting;
use Illuminate\Database\Seeder;

class StoreSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        StoreSetting::updateOrCreate(
            ['id' => 1],
            [
                'name' => 'Diva AC',
                'email' => 'divaac.workshop@gmail.com',
                'phone' => '628117998851',
                'whatsapp' => '628117998851',
                'address' => 'Jl. Brigjend Katamso, Lampung Tengah, Indonesia',
                'maps_link' => 'https://maps.app.goo.gl/U7B13w6BFdYH7e7e8',
                'instagram_link' => 'https://www.instagram.com/diva_ac50/',
                'facebook_link' => 'https://www.facebook.com/DivaAc/',
                'tiktok_link' => 'https://www.tiktok.com/@divaac50',
                'opening_hours' => [
                    'Monday' => ['open' => '08:00', 'close' => '17:00', 'is_closed' => false],
                    'Tuesday' => ['open' => '08:00', 'close' => '17:00', 'is_closed' => false],
                    'Wednesday' => ['open' => '08:00', 'close' => '17:00', 'is_closed' => false],
                    'Thursday' => ['open' => '08:00', 'close' => '17:00', 'is_closed' => false],
                    'Friday' => ['open' => '08:00', 'close' => '17:00', 'is_closed' => false],
                    'Saturday' => ['open' => '08:00', 'close' => '17:00', 'is_closed' => false],
                    'Sunday' => ['open' => '08:00', 'close' => '17:00', 'is_closed' => true],
                ]
            ]
        );
    }
}
