<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'cover_image',
        'lat',
        'lng',
    ];

    public function serviceProviders()
    {
        return $this->hasMany(ServiceProvider::class);
    }
} 