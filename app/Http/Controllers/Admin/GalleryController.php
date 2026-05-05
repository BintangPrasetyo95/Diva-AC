<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/gallery', [
            'images' => GalleryItem::orderBy('order')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $path = $request->file('image')->store('gallery', 'public');

        GalleryItem::create([
            'image_path' => $path,
            'title' => $request->title,
            'description' => $request->description,
            'order' => GalleryItem::count() + 1,
        ]);

        return back()->with('success', 'Image uploaded successfully');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $item = GalleryItem::findOrFail($id);
        $item->update([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return back()->with('success', 'Image updated successfully');
    }

    public function destroy($id)
    {
        $item = GalleryItem::findOrFail($id);
        Storage::disk('public')->delete($item->image_path);
        $item->delete();

        return back()->with('success', 'Image deleted successfully');
    }
}
