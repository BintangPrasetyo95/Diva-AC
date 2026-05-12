<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Mobil;
use App\Models\Mekanik;
use App\Models\Sparepart;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('services', [
            'services' => Service::with(['mobil.pelanggan', 'mekanik', 'spareparts'])
                ->orderBy('tanggal_service', 'desc')
                ->get(),
            'mobils' => Mobil::with('pelanggan')->get(),
            'mekaniks' => Mekanik::where('aktif', true)->get(),
            'spareparts' => Sparepart::where('stock_sparepart', '>', 0)->orderBy('nama_sparepart')->get(),
            'users' => User::where('role', 'customer')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id_mobil' => 'required|exists:mobil,id',
            'id_mekanik' => 'required|exists:mekanik,id',
            'tanggal_service' => 'required|date',
            'tipe_service' => 'required|string|max:100',
            'harga_service' => 'required|numeric|min:0',
            'status_service' => 'required|in:antri,proses,selesai,batal',
            'catatan' => 'nullable|string',
            'spareparts' => 'nullable|array',
            'spareparts.*.id' => 'required|exists:sparepart,id',
            'spareparts.*.jumlah' => 'required|integer|min:1',
            'spareparts.*.harga_satuan' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated) {
            $service = Service::create($validated);

            $syncData = [];
            $totalSparepart = 0;
            if (!empty($validated['spareparts'])) {
                foreach ($validated['spareparts'] as $item) {
                    $syncData[$item['id']] = [
                        'jumlah' => $item['jumlah'],
                        'harga_satuan' => $item['harga_satuan'],
                    ];
                    $totalSparepart += ($item['jumlah'] * $item['harga_satuan']);
                }
                $service->spareparts()->sync($syncData);
            }

            $service->update(['total_service' => $validated['harga_service'] + $totalSparepart]);

            return back()->with('success', 'Service record created successfully');
        });
    }

    public function storeWithNewCar(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id_pelanggan' => 'required', // Can be 'new' or numeric ID
            'customer_name' => 'required_if:id_pelanggan,new|nullable|string|max:255',
            'customer_email' => 'required_if:id_pelanggan,new|nullable|email|unique:users,email',
            'customer_phone' => 'nullable|string|max:20',
            'no_polisi' => 'required|string|max:20|unique:mobil,no_polisi',
            'merk' => 'required|string|max:100',
            'tipe' => 'required|string|max:100',
            'warna' => 'nullable|string|max:50',
            'id_mekanik' => 'required|exists:mekanik,id',
            'tanggal_service' => 'required|date',
            'tipe_service' => 'required|string|max:100',
            'harga_service' => 'required|numeric|min:0',
            'status_service' => 'required|in:antri,proses,selesai,batal',
            'catatan' => 'nullable|string',
            'spareparts' => 'nullable|array',
            'spareparts.*.id' => 'required|exists:sparepart,id',
            'spareparts.*.jumlah' => 'required|integer|min:1',
            'spareparts.*.harga_satuan' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated) {
            $userId = $validated['id_pelanggan'];

            if ($userId === 'new') {
                $user = User::create([
                    'name' => $validated['customer_name'],
                    'email' => $validated['customer_email'],
                    'phone' => $validated['customer_phone'],
                    'password' => Hash::make('password123'),
                    'role' => 'customer',
                ]);
                $userId = $user->id;
            }

            $mobil = Mobil::create([
                'id_pelanggan' => $userId,
                'no_polisi' => $validated['no_polisi'],
                'merk' => $validated['merk'],
                'tipe' => $validated['tipe'],
                'warna' => $validated['warna'],
            ]);

            $serviceData = [
                'id_mobil' => $mobil->id,
                'id_mekanik' => $validated['id_mekanik'],
                'tanggal_service' => $validated['tanggal_service'],
                'tipe_service' => $validated['tipe_service'],
                'harga_service' => $validated['harga_service'],
                'status_service' => $validated['status_service'],
                'catatan' => $validated['catatan'] ?? null,
            ];

            $service = Service::create($serviceData);

            $syncData = [];
            $totalSparepart = 0;
            if (!empty($validated['spareparts'])) {
                foreach ($validated['spareparts'] as $item) {
                    $syncData[$item['id']] = [
                        'jumlah' => $item['jumlah'],
                        'harga_satuan' => $item['harga_satuan'],
                    ];
                    $totalSparepart += ($item['jumlah'] * $item['harga_satuan']);
                }
                $service->spareparts()->sync($syncData);
            }

            $service->update(['total_service' => $validated['harga_service'] + $totalSparepart]);

            return back()->with('success', 'Service and vehicle created successfully');
        });
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
            'harga_service' => 'required|numeric|min:0',
            'status_service' => 'required|in:antri,proses,selesai,batal',
            'catatan' => 'nullable|string',
            'spareparts' => 'nullable|array',
            'spareparts.*.id' => 'required|exists:sparepart,id',
            'spareparts.*.jumlah' => 'required|integer|min:1',
            'spareparts.*.harga_satuan' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated, $service) {
            $service->update([
                'id_mobil' => $validated['id_mobil'],
                'id_mekanik' => $validated['id_mekanik'],
                'tanggal_service' => $validated['tanggal_service'],
                'tipe_service' => $validated['tipe_service'],
                'harga_service' => $validated['harga_service'],
                'status_service' => $validated['status_service'],
                'catatan' => $validated['catatan'] ?? null,
            ]);

            $syncData = [];
            $totalSparepart = 0;
            if (!empty($validated['spareparts'])) {
                foreach ($validated['spareparts'] as $item) {
                    $syncData[$item['id']] = [
                        'jumlah' => $item['jumlah'],
                        'harga_satuan' => $item['harga_satuan'],
                    ];
                    $totalSparepart += ($item['jumlah'] * $item['harga_satuan']);
                }
            }
            
            $service->spareparts()->sync($syncData);
            $service->update(['total_service' => $validated['harga_service'] + $totalSparepart]);

            return back()->with('success', 'Service record updated successfully');
        });
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
