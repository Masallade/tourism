<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceProvider extends Model
{
    use HasFactory;

    protected $fillable = [
        'country_id',
        'name',
        'type',
        'description',
        'price_range',
        'website',
        'email',
        'phone',
        'is_approved',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'lat' => 'decimal:7',
        'lng' => 'decimal:7',
    ];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function themes()
    {
        return $this->belongsToMany(Theme::class, 'provider_theme');
    }
} 