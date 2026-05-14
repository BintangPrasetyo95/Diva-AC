<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nama_pelanggan', 'no_telp', 'email', 'jenis_kelamin', 'alamat', 'tanggal_daftar'])]
class Pelanggan extends User
{
    use HasFactory;

    protected $table = 'users';

    protected static function booted()
    {
        static::addGlobalScope('role', function ($builder) {
            $builder->where('role', 'customer');
        });

        static::creating(function ($model) {
            $model->role = 'customer';
        });
    }

    public function mobils(): HasMany
    {
        return $this->hasMany(Mobil::class, 'id_pelanggan');
    }
}