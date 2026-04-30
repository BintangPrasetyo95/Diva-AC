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
        Schema::create('penjualan_sparepart_detail', function (Blueprint $table) {
            $table->foreignId('id_penjualan')->constrained('penjualan_sparepart')->onDelete('cascade');
            $table->foreignId('id_sparepart')->constrained('sparepart')->onDelete('restrict');
            $table->integer('jumlah')->default(1);
            $table->decimal('harga_satuan', 12, 2)->default(0);
            $table->primary(['id_penjualan', 'id_sparepart'], 'pj_detail_primary');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penjualan_sparepart_detail');
    }
};
