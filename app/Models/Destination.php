<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'subtitle',
        'is_active',
        'display_order',
        'description',
        'images', // JSON array of image paths
        'country_id',
    ];
    /**
     * Get the country for this destination
     */
    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    protected $casts = [
        'is_active' => 'boolean',
        'display_order' => 'integer',
        'images' => 'array', // Automatically cast JSON to array
    ];

    /**
     * Get the services for this destination
     */
    public function services()
    {
        return $this->belongsToMany(Service::class, 'destination_service')
            ->withTimestamps()
            ->orderBy('destination_service.created_at', 'desc');
    }

    /**
     * Scope to get only active destinations
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by display order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order', 'asc')->orderBy('created_at', 'desc');
    }
}