<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nama_pelanggan', 'no_telp', 'email', 'jenis_kelamin', 'alamat', 'tanggal_daftar'])]
class Pelanggan extends Model
{
    use HasFactory;

    protected $table = 'pelanggan';

    public function mobils(): HasMany
    {
        return $this->hasMany(Mobil::class, 'id_pelanggan');
    }
}
