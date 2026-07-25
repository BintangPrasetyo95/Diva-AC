<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sparepart;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use App\Actions\UploadImageAction;

class SparepartController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('inventory', [
            'spareparts' => Sparepart::orderBy('created_at', 'desc')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_sparepart' => 'required|string|max:100',
            'tipe_sparepart' => 'required|string|max:50',
            'harga_sparepart' => 'required|numeric|min:0',
            'stock_sparepart' => 'required|integer|min:0',
            'is_public' => 'required|boolean',
            'image_file' => 'nullable|image|max:2048',
            'keterangan' => 'nullable|string',
        ]);

        if ($request->hasFile('image_file')) {
            $action = new UploadImageAction();
            $path = $action->execute($request->file('image_file'), 'spareparts');
            $validated['image'] = $path;
        }

        unset($validated['image_file']);

        Sparepart::create($validated);

        return back()->with('success', 'Sparepart created successfully');
    }

    public function update(Request $request, Sparepart $sparepart): RedirectResponse
    {
        $validated = $request->validate([
            'nama_sparepart' => 'required|string|max:100',
            'tipe_sparepart' => 'required|string|max:50',
            'harga_sparepart' => 'required|numeric|min:0',
            'stock_sparepart' => 'required|integer|min:0',
            'is_public' => 'required|boolean',
            'image_file' => 'nullable|image|max:2048',
            'keterangan' => 'nullable|string',
        ]);

        if ($request->hasFile('image_file')) {
            $action = new UploadImageAction();
            $path = $action->execute($request->file('image_file'), 'spareparts', $sparepart->image);
            $validated['image'] = $path;
        }

        unset($validated['image_file']);

        $sparepart->update($validated);

        return back()->with('success', 'Sparepart updated successfully');
    }

    public function destroy(Sparepart $sparepart): RedirectResponse
    {

        $sparepart->delete();

        return back()->with('success', 'Sparepart deleted successfully');
    }
}
