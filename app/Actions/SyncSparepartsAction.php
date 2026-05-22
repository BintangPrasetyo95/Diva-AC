<?php

namespace App\Actions;

use App\Models\Sparepart;
use Illuminate\Database\Eloquent\Model;

class SyncSparepartsAction
{
    /**
     * Syncs spareparts to a model (Service or PenjualanSparepart) and returns the total price.
     *
     * @param Model $model The model that has a `spareparts()` BelongsToMany relationship.
     * @param array|null $items Array of items containing 'id' (or 'partId') and 'jumlah'. 
     *                          It can optionally contain 'harga_satuan', but if missing, it will fetch from DB.
     * @return float The total price of the synced spareparts.
     */
    public function execute(Model $model, ?array $items): float
    {
        if (empty($items)) {
            $model->spareparts()->sync([]);
            return 0.0;
        }

        $syncData = [];
        $totalHarga = 0.0;

        foreach ($items as $item) {
            $partId = $item['id'] ?? $item['partId'];
            $jumlah = $item['jumlah'] ?? 1;
            
            // Allow overriding harga_satuan from request, otherwise fetch current price
            if (isset($item['harga_satuan'])) {
                $harga = (float) $item['harga_satuan'];
            } else {
                $sparepart = Sparepart::findOrFail($partId);
                $harga = (float) $sparepart->harga_sparepart;
            }

            $syncData[$partId] = [
                'jumlah' => $jumlah,
                'harga_satuan' => $harga,
            ];

            $totalHarga += ($jumlah * $harga);
        }

        $model->spareparts()->sync($syncData);

        return $totalHarga;
    }
}
