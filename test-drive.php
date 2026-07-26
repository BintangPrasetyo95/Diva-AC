<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
try {
    ini_set('display_errors', 1);
    ini_set('default_socket_timeout', 10);
    echo "Uploading test-2.txt...\n";
    Illuminate\Support\Facades\Storage::disk('google')->put('test.txt', 'This is the first test file to confirm multiple uploads work!');
    Illuminate\Support\Facades\Storage::disk('google')->put('test-2.txt', 'This is the second test file to confirm multiple uploads work!');
    echo "Success!\n";
} catch (\Exception $e) {
    echo "\nError: " . $e->getMessage();
}
