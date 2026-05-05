<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\ServiceItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ServiceSettingsController extends Controller
{
    /**
     * Display the service settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('admin/landing-services', [
            'services' => ServiceItem::orderBy('order', 'asc')->get(),
        ]);
    }

    /**
     * Update the service settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'services' => 'required|array',
            'services.*.id' => 'nullable', // Can be null/string for new items
            'services.*.title_id' => 'required|string|max:255',
            'services.*.title_en' => 'required|string|max:255',
            'services.*.description_id' => 'required|string',
            'services.*.description_en' => 'required|string',
            'services.*.detailed_description_id' => 'nullable|string',
            'services.*.detailed_description_en' => 'nullable|string',
            'services.*.icon' => 'required|string',
            'services.*.image' => 'nullable|string',
            'services.*.is_active' => 'required|boolean',
        ]);

        $submittedIds = collect($validated['services'])
            ->filter(fn($s) => is_numeric($s['id']))
            ->pluck('id')
            ->toArray();

        // Delete services not in the submitted list
        ServiceItem::whereNotIn('id', $submittedIds)->get()->each(function ($service) {
            if ($service->image && str_starts_with($service->image, 'services/')) {
                Storage::disk('public')->delete($service->image);
            }
            $service->delete();
        });

        foreach ($validated['services'] as $index => $serviceData) {
            $id = $serviceData['id'];
            $isNew = !is_numeric($id);
            
            // Handle file upload
            if ($request->hasFile("services.{$index}.image_file")) {
                $path = $request->file("services.{$index}.image_file")->store('services', 'public');
                $serviceData['image'] = $path;
            }
            
            // Remove helper fields
            unset($serviceData['image_file']);
            
            // Set order based on array index
            $serviceData['order'] = $index;

            if ($isNew) {
                // Generate slug
                $slug = \Illuminate\Support\Str::slug($serviceData['title_en'], '-', 'en');
                $originalSlug = $slug;
                $count = 1;
                while (ServiceItem::where('slug', $slug)->exists()) {
                    $slug = $originalSlug . '-' . $count++;
                }
                $serviceData['slug'] = $slug;
                unset($serviceData['id']); // Remove temp ID
                ServiceItem::create($serviceData);
            } else {
                $service = ServiceItem::find($id, ['*']);
                if ($service) {
                    // Delete old image if new one is uploaded
                    if ($request->hasFile("services.{$index}.image_file") && $service->image && str_starts_with($service->image, 'services/')) {
                        Storage::disk('public')->delete($service->image);
                    }
                    $service->update($serviceData);
                }
            }
        }

        return back()->with('status', 'services-updated');
    }
}
