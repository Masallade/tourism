<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceProvider extends Model
{
    use HasFactory;

    protected $fillable = [
        'country_id',
        'service_type_id',
        'name',
        'description',
        'price_range',
        'website',
        'email',
        'phone',
        'is_approved',
        'image',
        'documents',
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

    public function serviceType()
    {
        return $this->belongsTo(ServiceType::class);
    }

    public function themes()
    {
        return $this->belongsToMany(Theme::class, 'provider_theme');
    }
} 