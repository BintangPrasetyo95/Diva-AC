<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

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
    return inertia('services/details', ['id' => $id]);
})->name('services.details');
Route::get('/services/info/{slug}', function ($slug) {
    return inertia('services/info', ['slug' => $slug]);
})->name('services.info');


Route::inertia('/inventory', 'inventory')->name('inventory');
Route::inertia('/customers', 'customers')->name('customers');
