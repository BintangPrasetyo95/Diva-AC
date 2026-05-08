<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GalleryItem;

class GalleryItemSeeder extends Seeder
{
    public function run(): void
    {
        $images = [
            'g1.jpg',
            'g2.jpg',
            'g3.jpg',
            'g4.jpg',
            'g5.jpg',
            'g6.jpg',
            'g7.jpg',
            'g8.jpg',
            'g9.jpg',
            'g10.jpg',
        ];

        foreach ($images as $index => $image) {
            GalleryItem::create([
                'image_path' => '/img/gallery/' . $image,
                'title' => 'Diva AC Gallery ' . ($index + 1),
                'description' => 'Our professional AC service work in action.',
                'order' => $index,
                'is_active' => true,
            ]);
        }
    }
}
