<?php

namespace App\Actions;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UploadImageAction
{
    /**
     * Uploads an image, deletes the old one if provided, and returns the new path.
     *
     * @param UploadedFile $file The uploaded file.
     * @param string $folder The folder to store the image in.
     * @param string|null $oldPath The path of the old image to delete.
     * @return string The path of the stored image.
     */
    public function execute(UploadedFile $file, string $folder, ?string $oldPath = null): string
    {
        if ($oldPath) {
            if (str_starts_with($oldPath, 'google:')) {
                $actualPath = substr($oldPath, 7);
                if (Storage::disk('google')->exists($actualPath)) {
                    Storage::disk('google')->delete($actualPath);
                }
            } else if (!str_starts_with($oldPath, 'http') && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        $path = $file->store($folder, 'google');
        return 'google:' . $path;
    }
}
