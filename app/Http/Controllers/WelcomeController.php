<?php

namespace App\Http\Controllers;

use App\Models\ServiceItem;
use App\Models\Sparepart;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    /**
     * Display the landing page.
     */
    public function index(): Response
    {
        return Inertia::render('welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'services' => ServiceItem::where('is_active', true)->orderBy('order')->get(),
            'gallery' => \App\Models\GalleryItem::where('is_active', true)->orderBy('order')->get(),
        ]);
    }

    /**
     * Display the spareparts landing page.
     */
    public function spareparts(): Response
    {
        return Inertia::render('spareparts', [
            'spareparts' => Sparepart::where('is_public', true)->get(),
        ]);
    }
}
