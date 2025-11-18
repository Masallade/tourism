<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AboutPage extends Model
{
    use HasFactory;

    protected $table = 'about_pages';

    protected $fillable = [
        'hero_title',
        'hero_subtitle',
        'hero_image',
        'mission_title',
        'mission_description',
        'mission_image',
        'mission_stat_number',
        'mission_stat_label',
        'values_title',
        'values',
        'impact_title',
        'impact_stat_1_number',
        'impact_stat_1_label',
        'impact_stat_2_number',
        'impact_stat_2_label',
        'impact_stat_3_number',
        'impact_stat_3_label',
        'impact_stat_4_number',
        'impact_stat_4_label',
        'team_title',
        'team_description',
        'team_members',
        'cta_title',
        'cta_description',
    ];

    protected $casts = [
        'team_members' => 'array',
        'values' => 'array',
    ];
}

