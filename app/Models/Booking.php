<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'service_id',
        'provider_id',
        'user_id',
        'contact_first_name',
        'contact_last_name',
        'contact_email',
        'phone_country_code',
        'phone_number',
        'receive_sms',
        'activity_date',
        'activity_time',
        'travelers_adults',
        'travelers_children',
        'lead_traveler_first_name',
        'lead_traveler_last_name',
        'pickup_location',
        'special_requests',
        'payment_timing',
        'payment_method',
        'promo_code',
        'promo_code_applied',
        'total_amount',
        'currency',
        'status',
        'form_snapshot',
    ];

    protected $casts = [
        'activity_date' => 'date',
        'receive_sms' => 'boolean',
        'promo_code_applied' => 'boolean',
        'form_snapshot' => 'array',
        'total_amount' => 'decimal:2',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function provider()
    {
        return $this->belongsTo(ServiceProvider::class, 'provider_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
