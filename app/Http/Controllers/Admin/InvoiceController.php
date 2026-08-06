<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PenjualanSparepart;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function show(Request $request)
    {
        $type = $request->query('type');
        $id = $request->query('id');

        if ($type === 'service') {
            $data = Service::with(['mobil.pelanggan', 'mekanik', 'spareparts', 'jasas'])->findOrFail($id);
            
            if ($request->user()->role === 'customer' && $data->mobil->id_pelanggan !== $request->user()->id) {
                abort(403, 'Unauthorized');
            }
        } elseif ($type === 'sparepart') {
            $data = PenjualanSparepart::with(['spareparts'])->findOrFail($id);
            
            if ($request->user()->role === 'customer' && $data->id_user !== $request->user()->id) {
                abort(403, 'Unauthorized');
            }
        } else {
            abort(404);
        }

        return Inertia::render('invoice', [
            'type' => $type,
            'data' => $data,
        ]);
    }
}
