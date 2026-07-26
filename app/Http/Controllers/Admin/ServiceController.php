<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mekanik;
use App\Models\Mobil;
use App\Models\Service;
use App\Models\Sparepart;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use App\Actions\SyncSparepartsAction;
use App\Actions\CreateCustomerAndCarAction;

class ServiceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('services', [
            'services' => Service::with(['mobil.pelanggan', 'mekanik', 'spareparts', 'jasas'])
                ->orderBy('tanggal_service', 'desc')
                ->get(),
            'mobils' => Mobil::with('pelanggan')->get(),
            'mekaniks' => Mekanik::with('user')->where('aktif', true)->get(),
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
            'tipe_service' => 'required|string|max:255',
            'harga_service' => 'required|numeric|min:0',
            'status_service' => 'required|in:antri,proses,selesai,batal',
            'bayar_service' => 'nullable|numeric|min:0',
            'catatan' => 'nullable|string',
            'spareparts' => 'nullable|array',
            'spareparts.*.id' => 'required|exists:sparepart,id',
            'spareparts.*.jumlah' => 'required|integer|min:1',
            'spareparts.*.harga_satuan' => 'required|numeric|min:0',
            'jasas' => 'nullable|array',
            'jasas.*.nama_jasa' => 'required|string|max:255',
            'jasas.*.harga_jasa' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated) {
            $service = Service::create($validated);

            $action = new SyncSparepartsAction();
            $totalSparepart = $action->execute($service, $validated['spareparts'] ?? []);

            $jasaAction = new \App\Actions\SyncJasasAction();
            $jasaAction->execute($service, $validated['jasas'] ?? []);

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
            'tipe_service' => 'required|string|max:255',
            'harga_service' => 'required|numeric|min:0',
            'status_service' => 'required|in:antri,proses,selesai,batal',
            'bayar_service' => 'nullable|numeric|min:0',
            'catatan' => 'nullable|string',
            'spareparts' => 'nullable|array',
            'spareparts.*.id' => 'required|exists:sparepart,id',
            'spareparts.*.jumlah' => 'required|integer|min:1',
            'spareparts.*.harga_satuan' => 'required|numeric|min:0',
            'jasas' => 'nullable|array',
            'jasas.*.nama_jasa' => 'required|string|max:255',
            'jasas.*.harga_jasa' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated) {
            if ($validated['id_pelanggan'] === 'new') {
                $mappedData = [
                    'nama_pelanggan' => $validated['customer_name'],
                    'email' => $validated['customer_email'] ?? null,
                    'no_telp' => $validated['customer_phone'] ?? '-',
                    'merk' => $validated['merk'],
                    'model' => $validated['tipe'],
                    'no_polisi' => $validated['no_polisi'],
                    'warna' => $validated['warna'] ?? null,
                ];

                $action = new CreateCustomerAndCarAction();
                $mobil = $action->execute($mappedData);
            } else {
                $mobil = Mobil::create([
                    'id_pelanggan' => $validated['id_pelanggan'],
                    'merk' => $validated['merk'],
                    'model' => $validated['tipe'],
                    'no_polisi' => $validated['no_polisi'],
                    'warna' => $validated['warna'] ?? null,
                ]);
            }
            
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

            $action = new SyncSparepartsAction();
            $totalSparepart = $action->execute($service, $validated['spareparts'] ?? []);

            $jasaAction = new \App\Actions\SyncJasasAction();
            $jasaAction->execute($service, $validated['jasas'] ?? []);

            $service->update(['total_service' => $validated['harga_service'] + $totalSparepart]);

            return back()->with('success', 'Service and vehicle created successfully');
        });
    }

    public function show($id): Response
    {
        return Inertia::render('services/details', [
            'id' => $id,
            'service' => Service::with(['mobil.pelanggan', 'mekanik', 'spareparts', 'jasas'])->findOrFail($id),
        ]);
    }

    public function update(Request $request, Service $service): RedirectResponse
    {
        $validated = $request->validate([
            'id_mobil' => 'required|exists:mobil,id',
            'id_mekanik' => 'required|exists:mekanik,id',
            'tanggal_service' => 'required|date',
            'tipe_service' => 'required|string|max:255',
            'harga_service' => 'required|numeric|min:0',
            'status_service' => 'required|in:antri,proses,selesai,batal',
            'bayar_service' => 'nullable|numeric|min:0',
            'catatan' => 'nullable|string',
            'spareparts' => 'nullable|array',
            'spareparts.*.id' => 'required|exists:sparepart,id',
            'spareparts.*.jumlah' => 'required|integer|min:1',
            'spareparts.*.harga_satuan' => 'required|numeric|min:0',
            'jasas' => 'nullable|array',
            'jasas.*.nama_jasa' => 'required|string|max:255',
            'jasas.*.harga_jasa' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated, $service) {
            $service->update([
                'id_mobil' => $validated['id_mobil'],
                'id_mekanik' => $validated['id_mekanik'],
                'tanggal_service' => $validated['tanggal_service'],
                'tipe_service' => $validated['tipe_service'],
                'harga_service' => $validated['harga_service'],
                'status_service' => $validated['status_service'],
                'bayar_service' => $validated['bayar_service'] ?? 0,
                'catatan' => $validated['catatan'] ?? null,
            ]);

            $action = new SyncSparepartsAction();
            $totalSparepart = $action->execute($service, $validated['spareparts'] ?? []);

            $jasaAction = new \App\Actions\SyncJasasAction();
            $jasaAction->execute($service, $validated['jasas'] ?? []);

            $service->update(['total_service' => $validated['harga_service'] + $totalSparepart]);

            return back()->with('success', 'Service record updated successfully');
        });
    }

    public function destroy(Service $service): RedirectResponse
    {

        $service->delete();

        return back()->with('success', 'Service record deleted successfully');
    }
}
