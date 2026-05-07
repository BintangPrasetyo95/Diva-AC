<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mobil;
use Inertia\Inertia;
use Inertia\Response;

class CarController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('cars', [
            'cars' => Mobil::with(['pelanggan', 'services.spareparts'])->orderBy('created_at', 'desc')->get(),
        ]);
    }
}
