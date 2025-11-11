<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'provider_id',
        'country_id',
        'name',
        'description',
        'price',
        'image',
        'image_2',
        'image_3',
        'min_age',
        'max_age',
        'duration',
        'overview',
        'details',
        'lat',
        'lng',
    ];

    protected $casts = [
        'lat' => 'decimal:7',
        'lng' => 'decimal:7',
    ];

    public function provider()
    {
        return $this->belongsTo(ServiceProvider::class, 'provider_id');
    }

    public function serviceTypes()
    {
        return $this->belongsToMany(ServiceType::class, 'service_service_type')->withTimestamps();
    }

    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }

    public function themes()
    {
        return $this->belongsToMany(Theme::class, 'service_theme')->withTimestamps();
    }
}
