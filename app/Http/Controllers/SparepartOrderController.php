<?php

namespace App\Http\Controllers;

use App\Models\PenjualanSparepart;
use App\Models\Sparepart;
use App\Models\StoreSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SparepartOrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:50',
            'address' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.partId' => 'required|exists:sparepart,id',
            'items.*.jumlah' => 'nullable|integer|min:1'
        ]);

        return DB::transaction(function () use ($validated) {
            $totalHarga = 0;
            $orderItems = [];

            // Calculate total price and prepare items
            foreach ($validated['items'] as $item) {
                $sparepart = Sparepart::findOrFail($item['partId']);
                $jumlah = $item['jumlah'] ?? 1;
                $harga = $sparepart->harga_sparepart;
                $subtotal = $harga * $jumlah;
                
                $totalHarga += $subtotal;
                
                $orderItems[$sparepart->id] = [
                    'jumlah' => $jumlah,
                    'harga_satuan' => $harga
                ];
            }

            // Create Order
            $order = PenjualanSparepart::create([
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'],
                'address' => $validated['address'],
                'tanggal_penjualan' => now()->toDateString(),
                'total_harga' => $totalHarga,
                'status' => 'pending'
            ]);

            $order->spareparts()->attach($orderItems);

            // Generate WhatsApp Link
            $storeSettings = StoreSetting::query()->first();
            $waNumber = $storeSettings->whatsapp ?? '628117998851';
            
            // Format WhatsApp Message
            $message = "Halo Diva AC,\n\nSaya ingin memesan sparepart berikut:\n\n";
            $message .= "*Detail Pemesan:*\n";
            $message .= "Nama: " . $order->customer_name . "\n";
            $message .= "No. HP: " . $order->customer_phone . "\n";
            $message .= "Alamat: " . $order->address . "\n\n";
            
            $message .= "*Pesanan (Order #" . $order->id . "):*\n";
            
            foreach ($validated['items'] as $item) {
                $sparepart = Sparepart::findOrFail($item['partId']);
                $jumlah = $item['jumlah'] ?? 1;
                $message .= "- " . $sparepart->nama_sparepart . " (" . $jumlah . "x)\n";
            }
            
            $message .= "\n*Total Harga: Rp " . number_format($totalHarga, 0, ',', '.') . "*\n\n";
            $message .= "Mohon informasi ketersediaan dan total pembayarannya. Terima kasih.";

            $waUrl = "https://wa.me/" . $waNumber . "?text=" . urlencode($message);

            return response()->json([
                'success' => true,
                'wa_url' => $waUrl,
                'order_id' => $order->id
            ]);
        });
    }
}
