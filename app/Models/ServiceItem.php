<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title_id',
        'title_en',
        'description_id',
        'description_en',
        'detailed_description_id',
        'detailed_description_en',
        'features_id',
        'features_en',
        'benefits_id',
        'benefits_en',
        'icon',
        'image',
        'order',
        'is_active',
    ];

    protected $casts = [
        'features_id' => 'array',
        'features_en' => 'array',
        'benefits_id' => 'array',
        'benefits_en' => 'array',
        'is_active' => 'boolean',
    ];
}
