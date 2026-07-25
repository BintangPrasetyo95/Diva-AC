<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tables = [
            'users', 'mekanik', 'mobil', 'sparepart', 'service', 
            'service_items', 'service_jasa', 'penjualan_sparepart', 
            'penjualan_sparepart_detail', 'gallery_items', 'admins', 
            'bookings', 'store_settings'
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->softDeletes();
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = [
            'users', 'mekanik', 'mobil', 'sparepart', 'service', 
            'service_items', 'service_jasa', 'penjualan_sparepart', 
            'penjualan_sparepart_detail', 'gallery_items', 'admins', 
            'bookings', 'store_settings'
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->dropSoftDeletes();
                });
            }
        }
    }
};
