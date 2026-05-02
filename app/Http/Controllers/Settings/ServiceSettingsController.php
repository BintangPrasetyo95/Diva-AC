<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\ServiceItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceSettingsController extends Controller
{
    /**
     * Display the service settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/services', [
            'services' => ServiceItem::orderBy('order')->get(),
        ]);
    }

    /**
     * Update the service settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'services' => 'required|array',
            'services.*.id' => 'required|exists:service_items,id',
            'services.*.title_id' => 'required|string|max:255',
            'services.*.title_en' => 'required|string|max:255',
            'services.*.description_id' => 'required|string',
            'services.*.description_en' => 'required|string',
            'services.*.detailed_description_id' => 'nullable|string',
            'services.*.detailed_description_en' => 'nullable|string',
            'services.*.icon' => 'required|string',
            'services.*.image' => 'nullable|string',
            'services.*.order' => 'required|integer',
            'services.*.is_active' => 'required|boolean',
        ]);

        foreach ($validated['services'] as $serviceData) {
            $service = ServiceItem::find($serviceData['id']);
            if ($service) {
                $service->update($serviceData);
            }
        }

        return back()->with('status', 'services-updated');
    }
}
