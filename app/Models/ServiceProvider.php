<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceProvider extends Model
{
    use HasFactory;

    // ...existing code...

    public function services()
    {
        return $this->hasMany(Service::class, 'provider_id');
    }

    // Alias for serviceTypes (for controller usage)
    public function getServiceTypesAttribute()
    {
        return $this->serviceTypes()->get();
    }

    protected $fillable = [
        'country_id',
        'name',
        'description',
        'price_range',
        'website',
        'email',
        'phone',
        'country_code',
        'is_approved',
        'image',
        'documents',
        'password',
        'lat',
        'lng',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'lat' => 'decimal:7',
        'lng' => 'decimal:7',
        'documents' => 'array',
    ];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function serviceTypes()
    {
        return $this->belongsToMany(ServiceType::class, 'service_provider_service_type');
    }

    // Alias for serviceType (singular) to match controller usage
    public function serviceType()
    {
        return $this->belongsToMany(ServiceType::class, 'service_provider_service_type');
    }

    public function themes()
    {
        return $this->belongsToMany(Theme::class, 'provider_theme');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'provider_id');
    }

    /**
     * Get the subscriptions for this service provider
     */
    public function subscriptions()
    {
        return $this->belongsToMany(Subscription::class, 'service_provider_subscriptions')
            ->withPivot('starts_at', 'expires_at', 'status')
            ->withTimestamps();
    }

    /**
     * Get the subscription records
     */
    public function providerSubscriptions()
    {
        return $this->hasMany(ServiceProviderSubscription::class);
    }

    /**
     * Get the payments for this service provider
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get active subscription
     */
    public function activeSubscription()
    {
        return $this->providerSubscriptions()
            ->where('status', 'active')
            ->where('expires_at', '>', now())
            ->first();
    }
} 