<?php

use App\Http\Controllers\Admin\BookingQueueController;
use App\Http\Controllers\Admin\CarController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\IncomeController;
use App\Http\Controllers\Admin\InvoiceController;
use App\Http\Controllers\Admin\MyAccountController;
use App\Http\Controllers\Admin\PenjualanSparepartController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\SparepartController;
use App\Http\Controllers\Admin\StoreStatusController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\SparepartOrderController;
use App\Http\Controllers\WelcomeController;
use App\Models\ServiceItem;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [WelcomeController::class, 'index'])->name('home');

// Public Pages
Route::get('booking', [BookingController::class, 'index'])->name('booking');
Route::post('booking', [BookingController::class, 'store'])->name('booking.store');
Route::get('spareparts', [WelcomeController::class, 'spareparts'])->name('spareparts');
Route::post('spareparts/order', [SparepartOrderController::class, 'store'])->name('spareparts.order');

Route::get('services/info/{slug}', function ($slug) {
    return Inertia::render('services/info', [
        'service' => ServiceItem::query()->where('slug', '=', $slug)->firstOrFail(),
    ]);
})->name('services.info');

// Admin Pages
Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('store-status', [StoreStatusController::class, 'toggle'])->name('store-status.toggle');

    // Inventory
    Route::get('inventory', [SparepartController::class, 'index'])->name('inventory');
    Route::post('inventory', [SparepartController::class, 'store'])->name('inventory.store');
    Route::put('inventory/{sparepart}', [SparepartController::class, 'update'])->name('inventory.update');
    Route::delete('inventory/{sparepart}', [SparepartController::class, 'destroy'])->name('inventory.destroy');

    // Sparepart Selling
    Route::get('spareparts/sell', [PenjualanSparepartController::class, 'index'])->name('spareparts.sell');
    Route::put('spareparts/sell/{id}', [PenjualanSparepartController::class, 'update'])->name('spareparts.sell.update');
    Route::patch('spareparts/sell/{id}/verify', [PenjualanSparepartController::class, 'verify'])->name('spareparts.sell.verify');
    Route::patch('spareparts/sell/{id}/cancel', [PenjualanSparepartController::class, 'cancel'])->name('spareparts.sell.cancel');

    // Customers
    Route::get('customers', [CustomerController::class, 'index'])->name('customers');
    Route::post('customers', [CustomerController::class, 'store'])->name('customers.store');
    Route::put('customers/{customer}', [CustomerController::class, 'update'])->name('customers.update');
    Route::delete('customers/{customer}', [CustomerController::class, 'destroy'])->name('customers.destroy');
    Route::post('customers/{customer}/mobils', [CustomerController::class, 'storeMobil'])->name('customers.mobils.store');
    Route::get('cars', [CarController::class, 'index'])->name('cars');
    Route::post('cars', [CarController::class, 'store'])->name('cars.store');
    Route::post('cars/with-user', [CarController::class, 'storeWithNewUser'])->name('cars.store-with-user');

    // Services
    Route::get('services', [ServiceController::class, 'index'])->name('services');
    Route::post('services', [ServiceController::class, 'store'])->name('services.store');
    Route::post('services/with-car', [ServiceController::class, 'storeWithNewCar'])->name('services.store-with-car');
    Route::put('services/{service}', [ServiceController::class, 'update'])->name('services.update');
    Route::delete('services/{service}', [ServiceController::class, 'destroy'])->name('services.destroy');

    // Invoices
    Route::get('invoice', [InvoiceController::class, 'show'])->name('invoice.show');
    Route::get('services/{id}', [ServiceController::class, 'show'])->name('services.details');
    Route::get('gallery', [GalleryController::class, 'index'])->name('admin.gallery');
    Route::post('gallery', [GalleryController::class, 'store'])->name('admin.gallery.store');
    Route::patch('gallery/{id}', [GalleryController::class, 'update'])->name('admin.gallery.update');
    Route::delete('gallery/{id}', [GalleryController::class, 'destroy'])->name('admin.gallery.destroy');
    Route::get('users', [UserController::class, 'index'])->name('admin.users');
    Route::post('users', [UserController::class, 'store'])->name('admin.users.store');
    Route::put('users/{user}', [UserController::class, 'update'])->name('admin.users.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');


    // Income
    Route::get('income', [IncomeController::class, 'index'])->name('admin.income');

    // Booking Queue
    Route::get('booking-queue', [BookingQueueController::class, 'index'])->name('admin.booking-queue');
    Route::patch('booking-queue/{booking}/status', [BookingQueueController::class, 'updateStatus'])->name('admin.booking-queue.status');
    Route::patch('booking-queue/{booking}/reschedule', [BookingQueueController::class, 'reschedule'])->name('admin.booking-queue.reschedule');

    // My Account
    Route::get('my-account', [MyAccountController::class, 'index'])->name('admin.my-account');
});

Route::inertia('/three', 'ThreePage')->name('three');

require __DIR__.'/settings.php';
