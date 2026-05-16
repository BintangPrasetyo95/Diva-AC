<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingQueueController extends Controller
{
    public function index()
    {
        // Get bookings for the next 14 days
        $startDate = now()->startOfDay();
        $endDate = now()->addDays(14)->endOfDay();

        $bookings = Booking::whereBetween('booking_date', [$startDate, $endDate])
            ->orderBy('booking_date')
            ->orderBy('queue_order')
            ->get();

        return Inertia::render('admin/booking-queue', [
            'bookings' => $bookings,
        ]);
    }

    public function updateStatus(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
        ]);

        $booking->update($validated);

        return back()->with('success', 'Booking status updated.');
    }

    public function reschedule(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'booking_date' => 'required|date',
            'queue_order' => 'required|integer',
        ]);

        $booking->update($validated);

        return back()->with('success', 'Booking rescheduled.');
    }
}
