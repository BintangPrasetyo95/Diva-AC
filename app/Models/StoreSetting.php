<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreSetting extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'whatsapp',
        'address',
        'maps_link',
        'instagram_link',
        'facebook_link',
        'tiktok_link',
        'opening_hours',
        'logo_path',
        'favicon_path',
    ];

    protected $casts = [
        'opening_hours' => 'array',
    ];
}
