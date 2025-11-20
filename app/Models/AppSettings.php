<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppSettings extends Model
{
    use HasFactory;

    protected $table = 'app_settings';

    protected $fillable = [
        'company_name',
        'company_description',
        'address',
        'phone',
        'country_code',
        'email',
        'twitter_url',
        'instagram_url',
        'linkedin_url',
        'facebook_url',
        'youtube_url',
        'tiktok_url',
    ];
}







