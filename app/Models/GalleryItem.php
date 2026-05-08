<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GalleryItem extends Model
{
    protected $fillable = [
        'image_path',
        'title',
        'description',
        'order',
        'is_active',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if (!$this->image_path) return null;
        if (str_starts_with($this->image_path, 'http')) return $this->image_path;
        if (str_starts_with($this->image_path, 'img/')) return asset($this->image_path);
        if (str_starts_with($this->image_path, '/img/')) return asset($this->image_path);
        
        return asset('storage/' . $this->image_path);
    }
}
