<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "\n";
echo "╔══════════════════════════════════════════════════════════════════════╗\n";
echo "║                         PAYMENT RECORDS                              ║\n";
echo "╚══════════════════════════════════════════════════════════════════════╝\n\n";

// Get all payments with relationships
$payments = DB::table('payments')
    ->join('service_providers', 'payments.service_provider_id', '=', 'service_providers.id')
    ->join('subscriptions', 'payments.subscription_id', '=', 'subscriptions.id')
    ->select(
        'payments.id',
        'payments.transaction_id',
        'service_providers.name as provider_name',
        'subscriptions.heading as plan_name',
        'payments.amount',
        'payments.currency',
        'payments.card_brand',
        'payments.card_last_4',
        'payments.cardholder_name',
        'payments.status',
        'payments.paid_at',
        'payments.created_at'
    )
    ->orderBy('payments.created_at', 'desc')
    ->get();

if ($payments->isEmpty()) {
    echo "❌ No payments found yet.\n\n";
} else {
    echo "Total Payments: " . $payments->count() . "\n";
    echo str_repeat("─", 70) . "\n\n";
    
    foreach($payments as $index => $payment) {
        echo "Payment #" . ($index + 1) . "\n";
        echo "├─ ID: " . $payment->id . "\n";
        echo "├─ Transaction ID: " . $payment->transaction_id . "\n";
        echo "├─ Provider: " . $payment->provider_name . "\n";
        echo "├─ Plan: " . $payment->plan_name . "\n";
        echo "├─ Amount: " . $payment->currency . " " . number_format($payment->amount, 2) . "\n";
        echo "├─ Card: " . $payment->card_brand . " •••• " . $payment->card_last_4 . "\n";
        echo "├─ Cardholder: " . $payment->cardholder_name . "\n";
        echo "├─ Status: " . strtoupper($payment->status) . "\n";
        echo "├─ Paid At: " . $payment->paid_at . "\n";
        echo "└─ Created: " . $payment->created_at . "\n";
        echo str_repeat("─", 70) . "\n\n";
    }
}

echo "\n";
echo "╔══════════════════════════════════════════════════════════════════════╗\n";
echo "║                    ACTIVE SUBSCRIPTIONS                              ║\n";
echo "╚══════════════════════════════════════════════════════════════════════╝\n\n";

$subscriptions = DB::table('service_provider_subscriptions')
    ->join('service_providers', 'service_provider_subscriptions.service_provider_id', '=', 'service_providers.id')
    ->join('subscriptions', 'service_provider_subscriptions.subscription_id', '=', 'subscriptions.id')
    ->select(
        'service_provider_subscriptions.id',
        'service_providers.name as provider_name',
        'subscriptions.heading as plan_name',
        'subscriptions.amount',
        'subscriptions.period',
        'service_provider_subscriptions.starts_at',
        'service_provider_subscriptions.expires_at',
        'service_provider_subscriptions.status'
    )
    ->get();

if ($subscriptions->isEmpty()) {
    echo "❌ No active subscriptions.\n\n";
} else {
    echo "Total Subscriptions: " . $subscriptions->count() . "\n";
    echo str_repeat("─", 70) . "\n\n";
    
    foreach($subscriptions as $index => $sub) {
        echo "Subscription #" . ($index + 1) . "\n";
        echo "├─ Provider: " . $sub->provider_name . "\n";
        echo "├─ Plan: " . $sub->plan_name . " (\$" . number_format($sub->amount, 2) . "/" . $sub->period . ")\n";
        echo "├─ Starts: " . $sub->starts_at . "\n";
        echo "├─ Expires: " . $sub->expires_at . "\n";
        echo "└─ Status: " . strtoupper($sub->status) . "\n";
        echo str_repeat("─", 70) . "\n\n";
    }
}

echo "\n";
echo "╔══════════════════════════════════════════════════════════════════════╗\n";
echo "║                    AVAILABLE PLANS                                   ║\n";
echo "╚══════════════════════════════════════════════════════════════════════╝\n\n";

$plans = DB::table('subscriptions')
    ->orderBy('display_order')
    ->get();

if ($plans->isEmpty()) {
    echo "❌ No subscription plans.\n\n";
} else {
    foreach($plans as $index => $plan) {
        $status = $plan->is_active ? "✓ ACTIVE" : "✗ INACTIVE";
        echo ($index + 1) . ". " . $plan->heading . " " . $status . "\n";
        echo "   Description: " . $plan->description . "\n";
        echo "   Price: $" . number_format($plan->amount, 2) . "/" . $plan->period . "\n";
        echo "\n";
    }
}

echo "\n✅ All tables are working properly!\n\n";







