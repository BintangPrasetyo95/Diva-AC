<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GalleryItem;

class GalleryItemSeeder extends Seeder
{
    public function run(): void
    {
        $images = [
            '635ynwdwFw0iaHDUYrcoX4JgWKKTJYGWMLDfRvj8.webp',
            '8x5nksMouZB5Dz9JS0RXqpaRMEvF1r0vf4CThcv2.webp',
            'AJXFDqPWndFdYGuQlRqASEP7zIpK62O9jJT1N1jx.webp',
            'D0aJXw696lurNJhx8pWejpvKPMLIQDn9YmXHzues.webp',
            'GLn9dnBt25o3rvofWgJYVgbE8bcje3YoUzQ2jQaz.webp',
            'Hlq42t3j9YDO1dPHAt14ioMUVn2ckoxqsrxgjuNS.webp',
            'Qh1zDjwCFq6RcEeMIryguv76bQSc7SCS1ydpidox.webp',
            'RfDyvTUhujiOASfd9zp4bkCDDbaJp3tiMSLvO1fe.webp',
            'bvL8DOamRY1Hyq3W4TgkIw3S8stuIBJ7tiDDJoiZ.webp',
            'vwQoxlamju17zzwisZp71OLx3VF8C2rd0mblFi6M.webp',
        ];

        foreach ($images as $index => $image) {
            GalleryItem::create([
                'image_path' => 'gallery/' . $image,
                'title' => 'Diva AC Gallery ' . ($index + 1),
                'description' => 'Our professional AC service work in action.',
                'order' => $index,
                'is_active' => true,
            ]);
        }
    }
}
