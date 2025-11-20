<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    /**
     * Store a newly created booking.
     */
    public function store(Request $request, Service $service)
    {
        $data = $request->validate([
            'contact_first_name' => ['required', 'string', 'max:255'],
            'contact_last_name' => ['required', 'string', 'max:255'],
            'contact_email' => ['required', 'email', 'max:255'],
            'phone_country_code' => ['nullable', 'string', 'max:10'],
            'phone_number' => ['nullable', 'string', 'max:30'],
            'receive_sms' => ['boolean'],
            'activity_date' => ['required', 'date', 'after:yesterday'],
            'activity_time' => ['nullable', 'string', 'max:20'],
            'travelers_adults' => ['required', 'integer', 'min:1', 'max:50'],
            'travelers_children' => ['nullable', 'integer', 'min:0', 'max:50'],
            'lead_traveler_first_name' => ['required', 'string', 'max:255'],
            'lead_traveler_last_name' => ['required', 'string', 'max:255'],
            'pickup_location' => ['nullable', 'string', 'max:255'],
            'special_requests' => ['nullable', 'string'],
            'payment_timing' => ['required', 'in:payNow,reserveNow'],
            'payment_method' => ['required', 'in:card,paypal,paypalLater,googlePay'],
            'promo_code' => ['nullable', 'string', 'max:50'],
            'promo_code_applied' => ['boolean'],
            'currency' => ['nullable', 'string', 'size:3'],
            'form_snapshot' => ['nullable', 'array'],
        ]);

        $user = $request->user();
        $children = $data['travelers_children'] ?? 0;
        $travelerCount = max(1, $data['travelers_adults'] + $children);
        $basePrice = $service->price ?? 0;
        $calculatedTotal = round($basePrice * $travelerCount, 2);
        $minAllowed = (int) ($service->min_travelers ?? 1);
        $maxAllowed = (int) ($service->max_travelers ?? $minAllowed);

        if ($travelerCount < $minAllowed || $travelerCount > $maxAllowed) {
            return response()->json([
                'message' => "This service only allows between {$minAllowed} and {$maxAllowed} traveler(s) per booking.",
            ], 422);
        }

        $booking = Booking::create([
            'reference' => $this->generateReference(),
            'service_id' => $service->id,
            'provider_id' => $service->provider_id,
            'user_id' => $user?->id,
            'contact_first_name' => $data['contact_first_name'],
            'contact_last_name' => $data['contact_last_name'],
            'contact_email' => $data['contact_email'],
            'phone_country_code' => $data['phone_country_code'] ?? '+92',
            'phone_number' => $data['phone_number'] ?? null,
            'receive_sms' => $data['receive_sms'] ?? false,
            'activity_date' => $data['activity_date'],
            'activity_time' => $data['activity_time'] ?? null,
            'travelers_adults' => $data['travelers_adults'],
            'travelers_children' => $children,
            'lead_traveler_first_name' => $data['lead_traveler_first_name'],
            'lead_traveler_last_name' => $data['lead_traveler_last_name'],
            'pickup_location' => $data['pickup_location'] ?? null,
            'special_requests' => $data['special_requests'] ?? null,
            'payment_timing' => $data['payment_timing'],
            'payment_method' => $data['payment_method'],
            'promo_code' => $data['promo_code'] ?? null,
            'promo_code_applied' => $data['promo_code_applied'] ?? false,
            'total_amount' => $calculatedTotal,
            'currency' => $data['currency'] ?? 'USD',
            'status' => 'pending',
            'form_snapshot' => $data['form_snapshot'] ?? null,
        ]);

        return response()->json([
            'message' => 'Booking created successfully.',
            'booking' => $booking->load(['service', 'provider']),
        ], 201);
    }

    /**
     * Generate a unique booking reference code.
     */
    protected function generateReference(): string
    {
        do {
            $reference = 'BK-' . Str::upper(Str::random(8));
        } while (Booking::where('reference', $reference)->exists());

        return $reference;
    }
}
