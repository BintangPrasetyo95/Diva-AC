<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule automatic daily backups (database and files)
use Illuminate\Support\Facades\Schedule;
Schedule::command('backup:run')->dailyAt('02:00'); // Runs every night at 2:00 AM
Schedule::command('backup:clean')->dailyAt('01:30'); // Cleans old backups before running the new one
