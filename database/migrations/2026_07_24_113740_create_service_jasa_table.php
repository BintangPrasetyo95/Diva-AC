<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_jasa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_service')->constrained('service')->cascadeOnDelete();
            $table->string('nama_jasa');
            $table->integer('harga_jasa')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_jasa');
    }
};
