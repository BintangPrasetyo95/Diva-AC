<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index()
    {
        return Inertia::render('booking');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'car_model' => 'required|string|max:255',
            'booking_date' => 'required|date|after_or_equal:today',
            'booking_time' => 'required',
            'service_type' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        // Get current max queue order for that date
        $maxOrder = Booking::where('booking_date', $validated['booking_date'])->max('queue_order') ?? 0;
        $validated['queue_order'] = $maxOrder + 1;

        Booking::create($validated);

        return back()->with('success', 'Booking submitted successfully. We will contact you soon!');
    }
}
