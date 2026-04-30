<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['id_mobil', 'id_mekanik', 'tanggal_service', 'tipe_service', 'harga_service', 'total_service', 'bayar_service', 'kembali_service', 'status_service', 'catatan'])]
class Service extends Model
{
    use HasFactory;

    protected $table = 'service';

    public function mobil(): BelongsTo
    {
        return $this->belongsTo(Mobil::class, 'id_mobil');
    }

    public function mekanik(): BelongsTo
    {
        return $this->belongsTo(Mekanik::class, 'id_mekanik');
    }

    public function spareparts(): BelongsToMany
    {
        return $this->belongsToMany(Sparepart::class, 'service_sparepart', 'id_service', 'id_sparepart')
            ->withPivot('jumlah', 'harga_satuan');
    }
}
