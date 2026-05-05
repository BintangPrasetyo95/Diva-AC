<?php

use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;

Route::get('/', [WelcomeController::class, 'index'])->name('home');

// Public Pages
Route::inertia('booking', 'booking')->name('booking');
Route::inertia('spareparts', 'spareparts')->name('spareparts');

Route::get('services/info/{slug}', function ($slug) {
    return Inertia::render('services/info', [
        'service' => \App\Models\ServiceItem::query()->where('slug', '=', $slug)->firstOrFail()
    ]);
})->name('services.info');

// Admin Pages
Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('inventory', 'inventory')->name('inventory');
    Route::inertia('customers', 'customers')->name('customers');
    Route::inertia('services', 'services')->name('services');
    Route::get('gallery', [App\Http\Controllers\Admin\GalleryController::class, 'index'])->name('admin.gallery');
    Route::post('gallery', [App\Http\Controllers\Admin\GalleryController::class, 'store'])->name('admin.gallery.store');
    Route::patch('gallery/{id}', [App\Http\Controllers\Admin\GalleryController::class, 'update'])->name('admin.gallery.update');
    Route::delete('gallery/{id}', [App\Http\Controllers\Admin\GalleryController::class, 'destroy'])->name('admin.gallery.destroy');
    Route::get('users', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('admin.users');
    Route::post('users', [App\Http\Controllers\Admin\UserController::class, 'store'])->name('admin.users.store');
    Route::put('users/{user}', [App\Http\Controllers\Admin\UserController::class, 'update'])->name('admin.users.update');
    Route::delete('users/{user}', [App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('admin.users.destroy');
    Route::inertia('profile', 'admin/business-profile')->name('admin.profile');

    Route::get('services/{id}', function ($id) {
        return Inertia::render('services/details', ['id' => $id]);
    })->name('services.details');
});

Route::inertia('/three', 'ThreePage')->name('three');

require __DIR__.'/settings.php';
