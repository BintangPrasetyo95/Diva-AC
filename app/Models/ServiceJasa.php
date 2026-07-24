<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceJasa extends Model
{
    use HasFactory;

    protected $table = 'service_jasa';

    protected $fillable = [
        'id_service',
        'nama_jasa',
        'harga_jasa',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class, 'id_service');
    }
}
