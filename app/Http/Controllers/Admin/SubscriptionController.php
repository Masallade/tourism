<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    /**
     * Get all subscriptions (admin)
     */
    public function index()
    {
        $subscriptions = Subscription::ordered()->get();
        
        return response()->json($subscriptions);
    }

    /**
     * Store a new subscription
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'heading' => 'required|string|max:255',
            'description' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'period' => 'required|string|max:50',
            'is_active' => 'boolean',
            'display_order' => 'nullable|integer|min:0',
        ]);

        $subscription = Subscription::create($validated);

        return response()->json($subscription, 201);
    }

    /**
     * Update a subscription
     */
    public function update(Request $request, Subscription $subscription)
    {
        $validated = $request->validate([
            'heading' => 'required|string|max:255',
            'description' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'period' => 'required|string|max:50',
            'is_active' => 'boolean',
            'display_order' => 'nullable|integer|min:0',
        ]);

        $subscription->update($validated);

        return response()->json($subscription);
    }

    /**
     * Delete a subscription
     */
    public function destroy(Subscription $subscription)
    {
        $subscription->delete();

        return response()->json(['message' => 'Subscription deleted successfully']);
    }
}
