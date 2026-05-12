<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Service;
use App\Models\PenjualanSparepart;

class InvoiceController extends Controller
{
    public function show(Request $request)
    {
        $type = $request->query('type');
        $id = $request->query('id');

        if ($type === 'service') {
            $data = Service::with(['mobil.pelanggan', 'mekanik', 'spareparts'])->findOrFail($id);
        } else if ($type === 'sparepart') {
            $data = PenjualanSparepart::with(['spareparts'])->findOrFail($id);
        } else {
            abort(404);
        }

        return Inertia::render('invoice', [
            'type' => $type,
            'data' => $data
        ]);
    }
}
