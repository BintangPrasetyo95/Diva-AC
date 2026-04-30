<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['id_user', 'tanggal_penjualan', 'total_harga', 'bayar', 'kembali'])]
class PenjualanSparepart extends Model
{
    use HasFactory;

    protected $table = 'penjualan_sparepart';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function spareparts(): BelongsToMany
    {
        return $this->belongsToMany(Sparepart::class, 'penjualan_sparepart_detail', 'id_penjualan', 'id_sparepart')
            ->withPivot('jumlah', 'harga_satuan');
    }
}
