<?php

namespace Database\Seeders;

use App\Models\ServiceItem;
use Illuminate\Database\Seeder;

class ServiceItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'slug' => 'ac-service',
                'title_id' => 'Service AC Mobil',
                'title_en' => 'Car AC Service',
                'description_id' => 'Diagnosa lengkap, pembersihan, dan perbaikan untuk semua jenis sistem AC mobil.',
                'description_en' => 'Complete diagnostics, cleaning, and repair for all types of car air conditioning systems.',
                'icon' => 'Wind',
                'image' => '/img/services/s1.jpg',
                'order' => 1,
            ],
            [
                'slug' => 'spare-parts',
                'title_id' => 'Jual Spare Parts',
                'title_en' => 'Sell Spare Parts',
                'description_id' => 'Suku cadang pengganti asli dan berkualitas tinggi termasuk kompresor, kondensor, dan lainnya.',
                'description_en' => 'Genuine and high-quality replacement parts including compressors, condensers, and more.',
                'icon' => 'ShoppingCart',
                'image' => '/img/services/s2.jpg',
                'order' => 2,
            ],
            [
                'slug' => 'maintenance',
                'title_id' => 'Perawatan Umum',
                'title_en' => 'General Maintenance',
                'description_id' => 'Pemeriksaan rutin untuk mencegah kerusakan besar dan menjaga performa pendinginan optimal.',
                'description_en' => 'Routine check-ups to prevent major failures and maintain optimal cooling performance.',
                'icon' => 'PenTool',
                'image' => '/img/services/s3.jpg',
                'order' => 3,
            ],
            [
                'slug' => 'freon-refill',
                'title_id' => 'Isi Freon',
                'title_en' => 'Freon Refilling',
                'description_id' => 'Pengisian ulang refrigeran berkualitas tinggi memastikan pendinginan yang aman bagi lingkungan dan efektif.',
                'description_en' => 'High-quality refrigerant recharging ensuring environmentally safe and effective cooling.',
                'icon' => 'Gauge',
                'image' => '/img/services/s4.jpg',
                'order' => 4,
            ],
            [
                'slug' => 'odor-removal',
                'title_id' => 'Penghilang Bau',
                'title_en' => 'Odor Removal',
                'description_id' => 'Perawatan khusus untuk menghilangkan bakteri dan bau tidak sedap dari ventilasi AC Anda.',
                'description_en' => 'Specialized treatment to eliminate bacteria and unpleasant smells from your AC vents.',
                'icon' => 'ShieldCheck',
                'image' => '/img/services/s5.jpg',
                'order' => 5,
            ],
            [
                'slug' => 'central-lock',
                'title_id' => 'Alarm, Central Lock & Power Window',
                'title_en' => 'Alarm, Central Lock & Power Window',
                'description_id' => 'Layanan khusus untuk alarm, central lock, dan power window mobil.',
                'description_en' => 'Specialized services for alarm, central lock, and power window systems.',
                'icon' => 'History',
                'image' => '/img/services/s6.jpg',
                'order' => 6,
            ],
            [
                'slug' => 'system-diagnostics',
                'title_id' => 'Diagnostik Sistem',
                'title_en' => 'System Diagnostics',
                'description_id' => 'Pemeriksaan menyeluruh menggunakan alat scan komputer canggih.',
                'description_en' => 'Thorough inspection using advanced computer scanning tools.',
                'icon' => 'Gauge',
                'image' => '/img/services/s4.jpg',
                'order' => 7,
            ],
            [
                'slug' => 'compressor-overhaul',
                'title_id' => 'Overhaul Kompresor',
                'title_en' => 'Compressor Overhaul',
                'description_id' => 'Perbaikan total kompresor untuk mengembalikan performa seperti baru.',
                'description_en' => 'Complete compressor repair to restore performance to like-new condition.',
                'icon' => 'PenTool',
                'image' => '/img/services/s3.jpg',
                'order' => 8,
            ],
        ];

        foreach ($services as $service) {
            ServiceItem::updateOrCreate(['slug' => $service['slug']], $service);
        }
    }
}
