<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Mobil;
use App\Models\Mekanik;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('services', [
            'services' => Service::with(['mobil.pelanggan', 'mekanik'])
                ->orderBy('tanggal_service', 'desc')
                ->get(),
            'mobils' => Mobil::with('pelanggan')->get(),
            'mekaniks' => Mekanik::where('aktif', true)->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id_mobil' => 'required|exists:mobil,id',
            'id_mekanik' => 'required|exists:mekanik,id',
            'tanggal_service' => 'required|date',
            'tipe_service' => 'required|string|max:100',
            'status_service' => 'required|in:antri,proses,selesai,batal',
            'catatan' => 'nullable|string',
        ]);

        Service::create($validated);

        return back()->with('success', 'Service record created successfully');
    }

    public function show($id): Response
    {
        return Inertia::render('services/details', [
            'id' => $id,
            'service' => Service::with(['mobil.pelanggan', 'mekanik', 'spareparts'])->findOrFail($id),
        ]);
    }

    public function update(Request $request, Service $service): RedirectResponse
    {
        $validated = $request->validate([
            'id_mobil' => 'required|exists:mobil,id',
            'id_mekanik' => 'required|exists:mekanik,id',
            'tanggal_service' => 'required|date',
            'tipe_service' => 'required|string|max:100',
            'status_service' => 'required|in:antri,proses,selesai,batal',
            'catatan' => 'nullable|string',
        ]);

        $service->update($validated);

        return back()->with('success', 'Service record updated successfully');
    }

    public function destroy(Service $service): RedirectResponse
    {
        // Check if has associated spareparts
        if ($service->spareparts()->exists()) {
            return back()->withErrors(['error' => 'Cannot delete service that has used spareparts. Cancel it instead.']);
        }

        $service->delete();

        return back()->with('success', 'Service record deleted successfully');
    }
}
