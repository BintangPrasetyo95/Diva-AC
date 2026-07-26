<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Storage;

echo "--- FOLDER CONTENTS ---\n";
try {
    $files = Storage::disk('google')->files();
    foreach($files as $file) {
        $size = Storage::disk('google')->size($file);
        echo "- " . $file . " (" . round($size / 1024 / 1024, 2) . " MB)\n";
    }
} catch (\Exception $e) {
    echo "Error reading folder: " . $e->getMessage() . "\n";
}

echo "\n--- STORAGE QUOTA ---\n";
try {
    $client = new \Google\Client();
    $client->setClientId(env('GOOGLE_DRIVE_CLIENT_ID'));
    $client->setClientSecret(env('GOOGLE_DRIVE_CLIENT_SECRET'));
    $client->refreshToken(env('GOOGLE_DRIVE_REFRESH_TOKEN'));
    
    $httpClient = new \GuzzleHttp\Client([
        'curl' => [CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4],
        'verify' => false
    ]);
    $client->setHttpClient($httpClient);

    $service = new \Google\Service\Drive($client);
    $about = $service->about->get(['fields' => 'storageQuota']);
    $quota = $about->getStorageQuota();
    
    $limit = $quota->getLimit();
    $usage = $quota->getUsage();
    
    if ($limit) {
        echo "Used: " . round($usage / 1024 / 1024 / 1024, 2) . " GB\n";
        echo "Limit: " . round($limit / 1024 / 1024 / 1024, 2) . " GB\n";
        echo "Free: " . round(($limit - $usage) / 1024 / 1024 / 1024, 2) . " GB\n";
    } else {
        echo "Used: " . round($usage / 1024 / 1024 / 1024, 2) . " GB (Unlimited storage)\n";
    }
} catch (\Exception $e) {
    echo "Error getting quota: " . $e->getMessage() . "\n";
}
