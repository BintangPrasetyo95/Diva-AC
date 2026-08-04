<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class StoreSetting extends Model
{
    use SoftDeletes;

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

    protected $appends = ['logo_url', 'favicon_url'];

    public function getLogoUrlAttribute()
    {
        if (! $this->logo_path) return null;
        if (str_starts_with($this->logo_path, 'google:')) return route('drive.image', ['path' => substr($this->logo_path, 7)]);
        return asset('storage/'.$this->logo_path);
    }

    public function getFaviconUrlAttribute()
    {
        if (! $this->favicon_path) return null;
        if (str_starts_with($this->favicon_path, 'google:')) return route('drive.image', ['path' => substr($this->favicon_path, 7)]);
        return asset('storage/'.$this->favicon_path);
    }

    public function isOpenNow()
    {
        $override = Cache::get('store_status_override');
        if ($override) {
            return $override === 'open';
        }

        if (empty($this->opening_hours)) {
            return false;
        }

        $day = now()->englishDayOfWeek; // e.g., 'Monday'
        $schedule = $this->opening_hours[$day] ?? null;

        if (! $schedule || ! empty($schedule['is_closed'])) {
            return false;
        }

        $now = now()->format('H:i');

        return $now >= $schedule['open'] && $now <= $schedule['close'];
    }
}
