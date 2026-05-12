<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PenjualanSparepart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PenjualanSparepartController extends Controller
{
    public function index(): Response
    {
        $orders = PenjualanSparepart::with(['spareparts'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customer_name' => $order->customer_name ?? '-',
                    'customer_phone' => $order->customer_phone ?? '-',
                    'address' => $order->address ?? '-',
                    'tanggal_penjualan' => $order->tanggal_penjualan,
                    'total_harga' => $order->total_harga,
                    'status' => $order->status,
                    'created_at' => $order->created_at,
                    'items' => $order->spareparts->map(function ($sp) {
                        return [
                            'nama_sparepart' => $sp->nama_sparepart,
                            'jumlah' => $sp->pivot->jumlah,
                            'harga_satuan' => $sp->pivot->harga_satuan,
                        ];
                    }),
                ];
            });

        return Inertia::render('spareparts/sell', [
            'orders' => $orders
        ]);
    }

    public function verify(Request $request, $id)
    {
        return DB::transaction(function () use ($id) {
            $order = PenjualanSparepart::with('spareparts')->findOrFail($id);
            
            if ($order->status !== 'pending') {
                return back()->with('error', 'Only pending orders can be verified.');
            }

            // Deduct stock
            foreach ($order->spareparts as $sparepart) {
                $qty = $sparepart->pivot->jumlah;
                $sparepart->decrement('stock_sparepart', $qty, []);
            }

            $order->update(['status' => 'selesai']);

            return back()->with('status', 'order-verified');
        });
    }

    public function cancel(Request $request, $id)
    {
        $order = PenjualanSparepart::findOrFail($id);
        
        if ($order->status !== 'pending') {
            return back()->with('error', 'Only pending orders can be cancelled.');
        }

        $order->update(['status' => 'batal']);

        return back()->with('status', 'order-cancelled');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:50',
            'address' => 'required|string',
        ]);

        $order = PenjualanSparepart::findOrFail($id);
        $order->update($validated);

        return back()->with('status', 'order-updated');
    }
}
