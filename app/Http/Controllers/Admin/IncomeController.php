<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\PenjualanSparepart;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IncomeController extends Controller
{
    public function index(Request $request): Response
    {
        $year  = $request->integer('year',  now()->year);
        $month = $request->integer('month', now()->month);

        // ── Service income (bayar_service) ──────────────────────────────
        $serviceRows = Service::with(['mobil.pelanggan'])
            ->whereYear('tanggal_service',  $year)
            ->whereMonth('tanggal_service', $month)
            ->whereNotNull('bayar_service')
            ->where('bayar_service', '>', 0)
            ->orderByDesc('tanggal_service')
            ->get()
            ->map(fn($s) => [
                'id'       => $s->id,
                'date'     => $s->tanggal_service,
                'label'    => $s->tipe_service,
                'customer' => optional(optional($s->mobil)->pelanggan)->nama ?? '-',
                'amount'   => (float) $s->bayar_service,
                'type'     => 'service',
            ]);

        // ── Sparepart sales income (bayar) ───────────────────────────────
        $spareRows = PenjualanSparepart::whereYear('tanggal_penjualan',  $year)
            ->whereMonth('tanggal_penjualan', $month)
            ->whereNotNull('bayar')
            ->where('bayar', '>', 0)
            ->orderByDesc('tanggal_penjualan')
            ->get()
            ->map(fn($p) => [
                'id'       => $p->id,
                'date'     => $p->tanggal_penjualan,
                'label'    => 'Penjualan Sparepart',
                'customer' => optional($p->user)->name ?? '-',
                'amount'   => (float) $p->bayar,
                'type'     => 'sparepart',
            ]);

        $transactions = $serviceRows->merge($spareRows)
            ->sortByDesc('date')
            ->values();

        // ── Monthly totals per category ──────────────────────────────────
        $serviceTotal   = $serviceRows->sum('amount');
        $spareTotal     = $spareRows->sum('amount');
        $grandTotal     = $serviceTotal + $spareTotal;

        // ── 12-month chart data (current year) ──────────────────────────
        $months = collect(range(1, 12))->map(function ($m) use ($year) {
            $svc = Service::whereYear('tanggal_service', $year)
                ->whereMonth('tanggal_service', $m)
                ->where('bayar_service', '>', 0)
                ->sum('bayar_service');

            $spr = PenjualanSparepart::whereYear('tanggal_penjualan', $year)
                ->whereMonth('tanggal_penjualan', $m)
                ->where('bayar', '>', 0)
                ->sum('bayar');

            return [
                'month'    => $m,
                'service'  => (float) $svc,
                'sparepart'=> (float) $spr,
                'total'    => (float) ($svc + $spr),
            ];
        });

        // ── Available years (for year selector) ─────────────────────────
        $firstService = Service::min('tanggal_service');
        $firstSpare   = PenjualanSparepart::min('tanggal_penjualan');
        $firstYear    = min(
            $firstService ? Carbon::parse($firstService)->year : now()->year,
            $firstSpare   ? Carbon::parse($firstSpare)->year   : now()->year,
        );
        $availableYears = range($firstYear, now()->year);

        return Inertia::render('income', [
            'transactions'   => $transactions,
            'serviceTotal'   => $serviceTotal,
            'spareTotal'     => $spareTotal,
            'grandTotal'     => $grandTotal,
            'monthlyChart'   => $months,
            'currentYear'    => $year,
            'currentMonth'   => $month,
            'availableYears' => $availableYears,
        ]);
    }
}
