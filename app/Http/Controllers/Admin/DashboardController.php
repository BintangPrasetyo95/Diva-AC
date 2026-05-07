<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Sparepart;
use App\Models\Pelanggan;
use App\Models\PenjualanSparepart;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $now = now();

        // ── Monthly Revenue (service + sparepart sales) ──────────────────
        $serviceRevenue = Service::whereYear('tanggal_service', $now->year)
            ->whereMonth('tanggal_service', $now->month)
            ->where('bayar_service', '>', 0)
            ->sum('bayar_service');

        $spareRevenue = PenjualanSparepart::whereYear('tanggal_penjualan', $now->year)
            ->whereMonth('tanggal_penjualan', $now->month)
            ->where('bayar', '>', 0)
            ->sum('bayar');

        $monthlyRevenue = $serviceRevenue + $spareRevenue;

        // Previous month for delta
        $prevServiceRevenue = Service::whereYear('tanggal_service', $now->copy()->subMonth()->year)
            ->whereMonth('tanggal_service', $now->copy()->subMonth()->month)
            ->sum('bayar_service');

        $prevSpareRevenue = PenjualanSparepart::whereYear('tanggal_penjualan', $now->copy()->subMonth()->year)
            ->whereMonth('tanggal_penjualan', $now->copy()->subMonth()->month)
            ->sum('bayar');

        $prevMonthRevenue = $prevServiceRevenue + $prevSpareRevenue;

        $revenueDelta = $prevMonthRevenue > 0
            ? round((($monthlyRevenue - $prevMonthRevenue) / $prevMonthRevenue) * 100, 1)
            : null;

        // ── Active Services ───────────────────────────────────────────────
        $activeServices = Service::whereIn('status_service', ['antri', 'proses'])->count();
        $urgentServices = Service::where('status_service', 'antri')->count();

        // ── Low Stock Parts ───────────────────────────────────────────────
        $lowStockParts   = Sparepart::where('stock_sparepart', '<', 5)->count();
        $outOfStockParts = Sparepart::where('stock_sparepart', 0)->count();

        // ── New Customers (this month) ────────────────────────────────────
        $newCustomers = Pelanggan::whereYear('created_at', $now->year)
            ->whereMonth('created_at', $now->month)
            ->count();

        $prevNewCustomers = Pelanggan::whereYear('created_at', $now->copy()->subMonth()->year)
            ->whereMonth('created_at', $now->copy()->subMonth()->month)
            ->count();

        $customerDelta = $prevNewCustomers > 0
            ? round((($newCustomers - $prevNewCustomers) / $prevNewCustomers) * 100, 1)
            : null;

        // ── Recent Services (last 6) ──────────────────────────────────────
        $recentServices = Service::with(['mobil.pelanggan', 'mekanik'])
            ->orderByDesc('tanggal_service')
            ->limit(6)
            ->get()
            ->map(fn($s) => [
                'id'       => $s->id,
                'customer' => optional(optional($s->mobil)->pelanggan)->nama_pelanggan ?? '-',
                'car'      => optional($s->mobil)->nama_mobil ?? '-',
                'type'     => $s->tipe_service,
                'status'   => $s->status_service,
                'date'     => $s->tanggal_service,
            ]);

        // ── Low-stock items list ──────────────────────────────────────────
        $stockAlerts = Sparepart::where('stock_sparepart', '<', 5)
            ->orderBy('stock_sparepart')
            ->limit(5)
            ->get()
            ->map(fn($sp) => [
                'name'  => $sp->nama_sparepart,
                'stock' => $sp->stock_sparepart,
            ]);

        return Inertia::render('dashboard', [
            'monthlyRevenue'  => (float) $monthlyRevenue,
            'revenueDelta'    => $revenueDelta,
            'activeServices'  => $activeServices,
            'urgentServices'  => $urgentServices,
            'lowStockParts'   => $lowStockParts,
            'outOfStockParts' => $outOfStockParts,
            'newCustomers'    => $newCustomers,
            'customerDelta'   => $customerDelta,
            'recentServices'  => $recentServices,
            'stockAlerts'     => $stockAlerts,
        ]);
    }
}
