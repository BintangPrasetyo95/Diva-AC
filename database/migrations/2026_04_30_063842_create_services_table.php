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
        Schema::create('service', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_mobil')->constrained('mobil')->onDelete('restrict');
            $table->foreignId('id_mekanik')->constrained('mekanik')->onDelete('restrict');
            $table->date('tanggal_service');
            $table->string('tipe_service', 100);
            $table->decimal('harga_service', 12, 2)->default(0);
            $table->decimal('total_service', 12, 2)->default(0);
            $table->decimal('bayar_service', 12, 2)->default(0);
            $table->decimal('kembali_service', 12, 2)->default(0);
            $table->enum('status_service', ['antri', 'proses', 'selesai', 'batal'])->default('antri');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service');
    }
};
