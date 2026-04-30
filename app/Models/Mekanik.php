<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nama_mekanik', 'jenis_kelamin', 'no_telp', 'level_mekanik', 'alamat', 'username', 'password', 'keterangan', 'aktif'])]
#[Hidden(['password'])]
class Mekanik extends Model
{
    use HasFactory;

    protected $table = 'mekanik';

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'aktif' => 'boolean',
        ];
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class, 'id_mekanik');
    }
}
