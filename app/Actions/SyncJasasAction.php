<?php

namespace App\Actions;

use App\Models\Service;
use App\Models\ServiceJasa;

class SyncJasasAction
{
    public function execute(Service $service, ?array $jasas): float
    {
        $service->jasas()->delete();
        
        if (empty($jasas)) {
            return 0.0;
        }

        $total = 0.0;

        foreach ($jasas as $jasa) {
            $harga = (float) ($jasa['harga_jasa'] ?? 0);
            
            $service->jasas()->create([
                'nama_jasa' => $jasa['nama_jasa'],
                'harga_jasa' => $harga,
            ]);

            $total += $harga;
        }

        return $total;
    }
}
