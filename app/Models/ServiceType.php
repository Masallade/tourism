<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceType extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function serviceProviders()
    {
        return $this->belongsToMany(ServiceProvider::class, 'service_provider_service_type');
    }
}
