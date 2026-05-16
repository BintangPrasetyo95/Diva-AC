<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_name',
        'customer_phone',
        'car_model',
        'booking_date',
        'booking_time',
        'service_type',
        'notes',
        'status',
        'queue_order',
    ];
}
