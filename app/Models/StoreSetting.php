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

    public function isOpenNow()
    {
        $override = \Illuminate\Support\Facades\Cache::get('store_status_override');
        if ($override) {
            return $override === 'open';
        }

        if (empty($this->opening_hours)) {
            return false;
        }

        $day = now()->englishDayOfWeek; // e.g., 'Monday'
        $schedule = $this->opening_hours[$day] ?? null;

        if (!$schedule || !empty($schedule['is_closed'])) {
            return false;
        }

        $now = now()->format('H:i');
        return $now >= $schedule['open'] && $now <= $schedule['close'];
    }
}
