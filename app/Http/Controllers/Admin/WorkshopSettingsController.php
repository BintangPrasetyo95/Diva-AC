<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StoreSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class WorkshopSettingsController extends Controller
{
    /**
     * Display the workshop settings page.
     */
    public function edit(): Response
    {
        $settings = StoreSetting::first() ?? StoreSetting::create([
            'name' => 'Diva AC',
            'email' => 'divaac.workshop@gmail.com',
            'phone' => '628117998851',
            'whatsapp' => '628117998851',
            'address' => 'Jl. Brigjend Katamso, Lampung Tengah, Indonesia',
            'maps_link' => 'https://maps.app.goo.gl/U7B13w6BFdYH7e7e8',
            'instagram_link' => 'https://www.instagram.com/diva_ac50/',
            'facebook_link' => 'https://www.facebook.com/DivaAc/',
            'tiktok_link' => 'https://www.tiktok.com/@divaac50',
            'opening_hours' => [
                'Monday' => ['open' => '08:00', 'close' => '17:00', 'is_closed' => false],
                'Tuesday' => ['open' => '08:00', 'close' => '17:00', 'is_closed' => false],
                'Wednesday' => ['open' => '08:00', 'close' => '17:00', 'is_closed' => false],
                'Thursday' => ['open' => '08:00', 'close' => '17:00', 'is_closed' => false],
                'Friday' => ['open' => '08:00', 'close' => '17:00', 'is_closed' => false],
                'Saturday' => ['open' => '08:00', 'close' => '17:00', 'is_closed' => false],
                'Sunday' => ['open' => '08:00', 'close' => '17:00', 'is_closed' => true],
            ]
        ]);

        return Inertia::render('admin/workshop-settings', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update the workshop settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $settings = StoreSetting::firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'whatsapp' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'maps_link' => 'nullable|string',
            'instagram_link' => 'nullable|string|url',
            'facebook_link' => 'nullable|string|url',
            'tiktok_link' => 'nullable|string|url',
            'opening_hours' => 'required|array',
            'logo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            if ($settings->logo_path) {
                Storage::disk('public')->delete($settings->logo_path);
            }
            $path = $request->file('logo')->store('branding', 'public');
            $validated['logo_path'] = $path;
        }

        unset($validated['logo']);

        $settings->update($validated);

        return back()->with('status', 'workshop-settings-updated');
    }
}
