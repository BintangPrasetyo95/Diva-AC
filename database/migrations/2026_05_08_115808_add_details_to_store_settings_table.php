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
        Schema::table('store_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('store_settings', 'name')) {
                $table->string('name')->default('Diva AC');
                $table->string('email')->nullable();
                $table->string('phone')->nullable();
                $table->string('whatsapp')->nullable();
                $table->text('address')->nullable();
                $table->text('maps_link')->nullable();
                $table->string('instagram_link')->nullable();
                $table->string('facebook_link')->nullable();
                $table->string('tiktok_link')->nullable();
                $table->json('opening_hours')->nullable();
                $table->string('logo_path')->nullable();
                $table->string('favicon_path')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('store_settings', function (Blueprint $table) {
            $table->dropColumn([
                'name', 'email', 'phone', 'whatsapp', 'address', 'maps_link',
                'instagram_link', 'facebook_link', 'tiktok_link', 'opening_hours',
                'logo_path', 'favicon_path'
            ]);
        });
    }
};
