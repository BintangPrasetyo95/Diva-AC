<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mobil;
use App\Models\Pelanggan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class CarController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('cars', [
            'cars'      => Mobil::with(['pelanggan', 'services.spareparts'])->orderBy('created_at', 'desc')->get(),
            'customers' => Pelanggan::orderBy('name', 'asc')->get()->map(fn($c) => [
                'id'   => $c->id,
                'name' => $c->nama_pelanggan,
                'telp' => $c->no_telp,
            ]),
        ]);
    }

    /**
     * Create a new car for an existing customer.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id_pelanggan' => 'required|exists:users,id',
            'merk'         => 'required|string|max:50',
            'model'        => 'nullable|string|max:50',
            'tahun'        => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'no_polisi'    => 'required|string|max:20|unique:mobil,no_polisi',
            'warna'        => 'nullable|string|max:30',
            'keterangan'   => 'nullable|string',
        ]);

        Mobil::create($validated);

        return back()->with('success', 'Kendaraan berhasil ditambahkan.');
    }

    /**
     * Create a new customer AND a car for them in one shot.
     */
    public function storeWithNewUser(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            // Customer fields
            'nama_pelanggan' => 'required|string|max:100',
            'no_telp'        => 'required|string|max:20',
            'email'          => 'required|email|max:100|unique:users,email',
            'jenis_kelamin'  => 'required|in:L,P',
            'alamat'         => 'required|string|max:255',
            // Car fields
            'merk'           => 'required|string|max:50',
            'model'          => 'nullable|string|max:50',
            'tahun'          => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'no_polisi'      => 'required|string|max:20|unique:mobil,no_polisi',
            'warna'          => 'nullable|string|max:30',
            'keterangan'     => 'nullable|string',
        ]);

        $customer = Pelanggan::create([
            'nama_pelanggan' => $validated['nama_pelanggan'],
            'no_telp'        => $validated['no_telp'],
            'email'          => $validated['email'],
            'jenis_kelamin'  => $validated['jenis_kelamin'],
            'alamat'         => $validated['alamat'],
            'tanggal_daftar' => now()->toDateString(),
            'password'       => Hash::make('password123'),
        ]);

        $customer->mobils()->create([
            'merk'        => $validated['merk'],
            'model'       => $validated['model'] ?? null,
            'tahun'       => $validated['tahun'] ?? null,
            'no_polisi'   => $validated['no_polisi'],
            'warna'       => $validated['warna'] ?? null,
            'keterangan'  => $validated['keterangan'] ?? null,
        ]);

        return back()->with('success', 'Pelanggan dan kendaraan berhasil ditambahkan.');
    }
}
