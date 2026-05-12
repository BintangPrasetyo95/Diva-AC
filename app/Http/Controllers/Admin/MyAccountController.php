<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mobil;
use App\Models\PenjualanSparepart;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MyAccountController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Cars owned by this user (via id_pelanggan = user id)
        $cars = Mobil::where('id_pelanggan', $user->id)
            ->with(['services' => function ($q) {
                $q->orderBy('tanggal_service', 'desc');
            }])
            ->get()
            ->map(fn($car) => [
                'id'         => $car->id,
                'merk'       => $car->merk,
                'model'      => $car->model,
                'tahun'      => $car->tahun,
                'no_polisi'  => $car->no_polisi,
                'warna'      => $car->warna,
                'keterangan' => $car->keterangan,
                'service_count' => $car->services->count(),
            ]);

        // Services for all cars of this user
        $carIds = Mobil::where('id_pelanggan', $user->id)->pluck('id');
        $services = Service::whereIn('id_mobil', $carIds)
            ->with(['mobil', 'mekanik'])
            ->orderBy('tanggal_service', 'desc')
            ->get()
            ->map(fn($svc) => [
                'id'              => $svc->id,
                'car'             => $svc->mobil ? "{$svc->mobil->merk} {$svc->mobil->model}" : '-',
                'no_polisi'       => $svc->mobil?->no_polisi ?? '-',
                'mekanik'         => $svc->mekanik?->nama_mekanik ?? '-',
                'tanggal_service' => $svc->tanggal_service,
                'tipe_service'    => $svc->tipe_service,
                'status_service'  => $svc->status_service,
                'total_service'   => $svc->total_service,
                'catatan'         => $svc->catatan,
            ]);

        // Sparepart purchases linked to this user
        $sparepartOrders = PenjualanSparepart::where('id_user', $user->id)
            ->with(['spareparts'])
            ->orderBy('tanggal_penjualan', 'desc')
            ->get()
            ->map(fn($order) => [
                'id'                => $order->id,
                'tanggal_penjualan' => $order->tanggal_penjualan,
                'status'            => $order->status,
                'total_harga'       => $order->total_harga,
                'bayar'             => $order->bayar,
                'kembali'           => $order->kembali,
                'items'             => $order->spareparts->map(fn($sp) => [
                    'name'       => $sp->nama_sparepart,
                    'qty'        => $sp->pivot->jumlah,
                    'harga'      => $sp->pivot->harga_satuan,
                ]),
            ]);

        return Inertia::render('my-account', [
            'profile'         => [
                'id'             => $user->id,
                'name'           => $user->name,
                'username'       => $user->username,
                'email'          => $user->email,
                'no_telp'        => $user->no_telp,
                'alamat'         => $user->alamat,
                'jenis_kelamin'  => $user->jenis_kelamin,
                'tanggal_daftar' => $user->tanggal_daftar,
                'role'           => $user->role,
            ],
            'cars'            => $cars,
            'services'        => $services,
            'sparepartOrders' => $sparepartOrders,
        ]);
    }
}
