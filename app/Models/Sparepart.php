<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['nama_sparepart', 'tipe_sparepart', 'harga_sparepart', 'stock_sparepart', 'keterangan', 'image', 'is_public'])]
class Sparepart extends Model
{
    use HasFactory;

    protected $table = 'sparepart';

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
        ];
    }

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if (!$this->image) return null;
        if (str_starts_with($this->image, 'http')) return $this->image;
        if (str_starts_with($this->image, 'img/')) return asset($this->image);
        if (str_starts_with($this->image, '/img/')) return asset($this->image);
        
        return asset('storage/' . $this->image);
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'service_sparepart', 'id_sparepart', 'id_service')
            ->withPivot('jumlah', 'harga_satuan');
    }

    public function penjualanSpareparts(): BelongsToMany
    {
        return $this->belongsToMany(PenjualanSparepart::class, 'penjualan_sparepart_detail', 'id_sparepart', 'id_penjualan')
            ->withPivot('jumlah', 'harga_satuan');
    }
}
