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
