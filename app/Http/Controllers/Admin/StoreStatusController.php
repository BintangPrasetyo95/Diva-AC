<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class StoreStatusController extends Controller
{
    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'is_open' => 'required|boolean'
        ]);

        $status = $validated['is_open'] ? 'open' : 'closed';
        Cache::put('store_status_override', $status, now()->endOfDay());

        return back()->with('status', 'store-status-updated');
    }
}
