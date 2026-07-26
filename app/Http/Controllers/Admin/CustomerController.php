<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mobil;
use App\Models\Pelanggan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('customers', [
            'customers' => Pelanggan::with('mobils')->orderBy('name', 'asc')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_pelanggan' => 'required|string|max:100',
            'username' => 'nullable|string|max:255|unique:users,username',
            'no_telp' => 'required|string|max:20',
            'email' => 'required|email|max:100|unique:users,email',
            'password' => 'nullable|string|min:8|confirmed',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat' => 'required|string|max:255',
        ]);

        if (! empty($validated['password'])) {
            $validated['password'] = \Illuminate\Support\Facades\Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        Pelanggan::create($validated);

        return back()->with('success', 'Customer created successfully');
    }

    public function update(Request $request, Pelanggan $customer): RedirectResponse
    {
        $validated = $request->validate([
            'nama_pelanggan' => 'required|string|max:100',
            'username' => 'nullable|string|max:255|unique:users,username,'.$customer->id,
            'no_telp' => 'required|string|max:20',
            'email' => 'required|email|max:100|unique:users,email,'.$customer->id,
            'password' => 'nullable|string|min:8|confirmed',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat' => 'required|string|max:255',
        ]);

        if (! empty($validated['password'])) {
            $validated['password'] = \Illuminate\Support\Facades\Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $customer->update($validated);

        return back()->with('success', 'Customer updated successfully');
    }

    public function destroy(Pelanggan $customer): RedirectResponse
    {

        // Delete cars first (or let cascade if configured, but here we restrict)
        $customer->mobils()->delete();
        $customer->delete();

        return back()->with('success', 'Customer deleted successfully');
    }

    // Mobil Management
    public function storeMobil(Request $request, Pelanggan $customer): RedirectResponse
    {
        $validated = $request->validate([
            'merk' => 'required|string|max:50',
            'model' => 'nullable|string|max:50',
            'tahun' => 'nullable|integer|min:1900|max:'.(date('Y') + 1),
            'no_polisi' => 'required|string|max:20|unique:mobil,no_polisi',
            'warna' => 'nullable|string|max:30',
            'keterangan' => 'nullable|string',
        ]);

        $customer->mobils()->create($validated);

        return back()->with('success', 'Vehicle added successfully');
    }
}
