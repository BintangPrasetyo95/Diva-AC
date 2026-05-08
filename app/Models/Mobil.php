<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['id_pelanggan', 'merk', 'model', 'tahun', 'no_polisi', 'warna', 'keterangan'])]
class Mobil extends Model
{
    use HasFactory;

    protected $table = 'mobil';

    public function pelanggan(): BelongsTo
    {
        return $this->belongsTo(Pelanggan::class, 'id_pelanggan');
    }

    public function getNamaMobilAttribute(): string
    {
        return "{$this->merk} {$this->model}";
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class, 'id_mobil');
    }
}
