<?php

use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;

Route::get('/', [WelcomeController::class, 'index'])->name('home');

// Public Pages
Route::inertia('booking', 'booking')->name('booking');
Route::get('spareparts', [WelcomeController::class, 'spareparts'])->name('spareparts');
Route::post('spareparts/order', [\App\Http\Controllers\SparepartOrderController::class, 'store'])->name('spareparts.order');

Route::get('services/info/{slug}', function ($slug) {
    return Inertia::render('services/info', [
        'service' => \App\Models\ServiceItem::query()->where('slug', '=', $slug)->firstOrFail()
    ]);
})->name('services.info');

// Admin Pages
Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    Route::get('dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::post('store-status', [App\Http\Controllers\Admin\StoreStatusController::class, 'toggle'])->name('store-status.toggle');
    
    // Inventory
    Route::get('inventory', [App\Http\Controllers\Admin\SparepartController::class, 'index'])->name('inventory');
    Route::post('inventory', [App\Http\Controllers\Admin\SparepartController::class, 'store'])->name('inventory.store');
    Route::post('inventory/{sparepart}', [App\Http\Controllers\Admin\SparepartController::class, 'update'])->name('inventory.update');
    Route::delete('inventory/{sparepart}', [App\Http\Controllers\Admin\SparepartController::class, 'destroy'])->name('inventory.destroy');
    
    // Sparepart Selling
    Route::get('spareparts/sell', [App\Http\Controllers\Admin\PenjualanSparepartController::class, 'index'])->name('spareparts.sell');
    Route::patch('spareparts/sell/{id}/verify', [App\Http\Controllers\Admin\PenjualanSparepartController::class, 'verify'])->name('spareparts.sell.verify');
    Route::patch('spareparts/sell/{id}/cancel', [App\Http\Controllers\Admin\PenjualanSparepartController::class, 'cancel'])->name('spareparts.sell.cancel');

    // Customers
    Route::get('customers', [App\Http\Controllers\Admin\CustomerController::class, 'index'])->name('customers');
    Route::post('customers', [App\Http\Controllers\Admin\CustomerController::class, 'store'])->name('customers.store');
    Route::put('customers/{customer}', [App\Http\Controllers\Admin\CustomerController::class, 'update'])->name('customers.update');
    Route::delete('customers/{customer}', [App\Http\Controllers\Admin\CustomerController::class, 'destroy'])->name('customers.destroy');
    Route::post('customers/{customer}/mobils', [App\Http\Controllers\Admin\CustomerController::class, 'storeMobil'])->name('customers.mobils.store');
    Route::get('cars', [App\Http\Controllers\Admin\CarController::class, 'index'])->name('cars');

    // Services
    Route::get('services', [App\Http\Controllers\Admin\ServiceController::class, 'index'])->name('services');
    Route::post('services', [App\Http\Controllers\Admin\ServiceController::class, 'store'])->name('services.store');
    Route::put('services/{service}', [App\Http\Controllers\Admin\ServiceController::class, 'update'])->name('services.update');
    Route::delete('services/{service}', [App\Http\Controllers\Admin\ServiceController::class, 'destroy'])->name('services.destroy');
    Route::get('services/{id}', [App\Http\Controllers\Admin\ServiceController::class, 'show'])->name('services.details');
    Route::get('gallery', [App\Http\Controllers\Admin\GalleryController::class, 'index'])->name('admin.gallery');
    Route::post('gallery', [App\Http\Controllers\Admin\GalleryController::class, 'store'])->name('admin.gallery.store');
    Route::patch('gallery/{id}', [App\Http\Controllers\Admin\GalleryController::class, 'update'])->name('admin.gallery.update');
    Route::delete('gallery/{id}', [App\Http\Controllers\Admin\GalleryController::class, 'destroy'])->name('admin.gallery.destroy');
    Route::get('users', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('admin.users');
    Route::post('users', [App\Http\Controllers\Admin\UserController::class, 'store'])->name('admin.users.store');
    Route::put('users/{user}', [App\Http\Controllers\Admin\UserController::class, 'update'])->name('admin.users.update');
    Route::delete('users/{user}', [App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('admin.users.destroy');

    Route::get('services/{id}', function ($id) {
        return Inertia::render('services/details', ['id' => $id]);
    })->name('services.details');

    // Income
    Route::get('income', [App\Http\Controllers\Admin\IncomeController::class, 'index'])->name('admin.income');
});

Route::inertia('/three', 'ThreePage')->name('three');

require __DIR__.'/settings.php';
