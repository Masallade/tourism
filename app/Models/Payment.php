<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_provider_id',
        'subscription_id',
        'amount',
        'currency',
        'payment_method',
        'card_last_4',
        'card_brand',
        'cardholder_name',
        'transaction_id',
        'status',
        'paid_at',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    /**
     * Get the service provider that owns the payment
     */
    public function serviceProvider()
    {
        return $this->belongsTo(ServiceProvider::class);
    }

    /**
     * Get the subscription associated with the payment
     */
    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }
}







