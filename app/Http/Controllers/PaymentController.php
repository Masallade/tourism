<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\ServiceProvider;
use App\Models\ServiceProviderSubscription;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PaymentController extends Controller
{
    /**
     * Process payment for service provider subscription
     */
    public function processPayment(Request $request)
    {
        $validated = $request->validate([
            'service_provider_id' => 'required|exists:service_providers,id',
            'subscription_id' => 'required|exists:subscriptions,id',
            'card_number' => 'required|string|min:13|max:19',
            'card_expiry' => ['required', 'string', 'regex:/^(0[1-9]|1[0-2])\/(0[0-9]|[2-9][0-9])$/'],
            'card_cvv' => 'required|string|min:3|max:4',
            'cardholder_name' => 'required|string|max:255',
        ]);

        try {
            // Get subscription details
            $subscription = Subscription::findOrFail($validated['subscription_id']);
            $serviceProvider = ServiceProvider::findOrFail($validated['service_provider_id']);

            // Mock payment processing (in real scenario, integrate with Stripe/PayPal)
            // For now, we'll simulate a successful payment
            $cardNumber = preg_replace('/\s+/', '', $validated['card_number']);
            $cardLast4 = substr($cardNumber, -4);
            $cardBrand = $this->detectCardBrand($cardNumber);

            // Generate unique transaction ID
            $transactionId = 'TXN-' . strtoupper(Str::random(12));

            // Create payment record
            $payment = Payment::create([
                'service_provider_id' => $validated['service_provider_id'],
                'subscription_id' => $validated['subscription_id'],
                'amount' => $subscription->amount,
                'currency' => 'USD',
                'payment_method' => 'card',
                'card_last_4' => $cardLast4,
                'card_brand' => $cardBrand,
                'cardholder_name' => $validated['cardholder_name'],
                'transaction_id' => $transactionId,
                'status' => 'completed',
                'paid_at' => now(),
            ]);

            // Calculate subscription dates
            $startsAt = Carbon::now();
            $expiresAt = $this->calculateExpiryDate($startsAt, $subscription->period);

            // Create service provider subscription
            $providerSubscription = ServiceProviderSubscription::create([
                'service_provider_id' => $validated['service_provider_id'],
                'subscription_id' => $validated['subscription_id'],
                'starts_at' => $startsAt,
                'expires_at' => $expiresAt,
                'status' => 'active',
            ]);

            // Update service provider status to pending approval (not approved yet)
            $serviceProvider->update([
                'is_approved' => false,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment processed successfully',
                'payment' => $payment,
                'subscription' => $providerSubscription->load('subscription'),
                'transaction_id' => $transactionId,
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Payment processing failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Payment processing failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get payment history for a service provider
     */
    public function getPaymentHistory($serviceProviderId)
    {
        $payments = Payment::where('service_provider_id', $serviceProviderId)
            ->with('subscription')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($payments);
    }

    /**
     * Detect card brand from card number
     */
    private function detectCardBrand($cardNumber)
    {
        $cardNumber = preg_replace('/\s+/', '', $cardNumber);
        
        // Visa
        if (preg_match('/^4/', $cardNumber)) {
            return 'Visa';
        }
        
        // Mastercard
        if (preg_match('/^5[1-5]/', $cardNumber)) {
            return 'Mastercard';
        }
        
        // American Express
        if (preg_match('/^3[47]/', $cardNumber)) {
            return 'American Express';
        }
        
        // Discover
        if (preg_match('/^6(?:011|5)/', $cardNumber)) {
            return 'Discover';
        }
        
        return 'Unknown';
    }

    /**
     * Calculate subscription expiry date based on period
     */
    private function calculateExpiryDate($startDate, $period)
    {
        $period = strtolower($period);
        
        switch ($period) {
            case 'daily':
                return $startDate->copy()->addDay();
            case 'weekly':
                return $startDate->copy()->addWeek();
            case 'monthly':
                return $startDate->copy()->addMonth();
            case 'yearly':
                return $startDate->copy()->addYear();
            case 'lifetime':
                return $startDate->copy()->addYears(100); // 100 years for lifetime
            default:
                return $startDate->copy()->addMonth(); // Default to monthly
        }
    }
}




