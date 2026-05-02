<?php

use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::get('/', [WelcomeController::class, 'index'])->name('home');

Route::inertia('dashboard', 'dashboard')->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    //
});

require __DIR__.'/settings.php';

Route::inertia('/three', 'ThreePage')->name('three');
Route::inertia('/booking', 'booking')->name('booking');
Route::inertia('/spareparts', 'spareparts')->name('spareparts');
Route::inertia('/services', 'services')->name('services');
Route::get('/services/{id}', function ($id) {
    return Inertia::render('services/details', ['id' => $id]);
})->name('services.details');
Route::get('/services/info/{slug}', function ($slug) {
    return Inertia::render('services/info', [
        'service' => \App\Models\ServiceItem::where('slug', $slug)->firstOrFail()
    ]);
})->name('services.info');


Route::inertia('/inventory', 'inventory')->name('inventory');
Route::inertia('/customers', 'customers')->name('customers');
