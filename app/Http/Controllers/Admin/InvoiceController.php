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
        } elseif ($type === 'sparepart') {
            $data = PenjualanSparepart::with(['spareparts'])->findOrFail($id);
        } else {
            abort(404);
        }

        return Inertia::render('invoice', [
            'type' => $type,
            'data' => $data,
        ]);
    }
}
