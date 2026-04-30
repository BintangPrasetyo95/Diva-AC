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
        Schema::create('mekanik', function (Blueprint $table) {
            $table->id();
            $table->string('nama_mekanik', 100);
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->string('no_telp', 20);
            $table->enum('level_mekanik', ['junior', 'senior', 'kepala'])->default('junior');
            $table->string('alamat', 255);
            $table->string('username', 100)->unique();
            $table->string('password', 255);
            $table->text('keterangan')->nullable();
            $table->boolean('aktif')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mekanik');
    }
};
