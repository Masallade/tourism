<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    /**
     * Get all active subscriptions (public)
     */
    public function index()
    {
        $subscriptions = Subscription::active()
            ->ordered()
            ->get();
        
        return response()->json($subscriptions);
    }

    /**
     * Get a single subscription
     */
    public function show($id)
    {
        $subscription = Subscription::findOrFail($id);
        
        return response()->json($subscription);
    }
}
