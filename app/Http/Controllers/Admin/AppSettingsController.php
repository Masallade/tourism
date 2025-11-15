<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppSettings;
use Illuminate\Http\Request;

class AppSettingsController extends Controller
{
    /**
     * Get app settings (single record or create default)
     */
    public function index()
    {
        $settings = AppSettings::first();
        
        // If no settings exist, return default empty structure
        if (!$settings) {
            return response()->json([
                'id' => null,
                'company_name' => null,
                'company_description' => null,
                'address' => null,
                'phone' => null,
                'email' => null,
                'twitter_url' => null,
                'instagram_url' => null,
                'linkedin_url' => null,
                'facebook_url' => null,
                'youtube_url' => null,
                'tiktok_url' => null,
            ]);
        }
        
        return response()->json($settings);
    }

    /**
     * Create or update app settings
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'nullable|string|max:255',
            'company_description' => 'nullable|string',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'twitter_url' => 'nullable|url|max:500',
            'instagram_url' => 'nullable|url|max:500',
            'linkedin_url' => 'nullable|url|max:500',
            'facebook_url' => 'nullable|url|max:500',
            'youtube_url' => 'nullable|url|max:500',
            'tiktok_url' => 'nullable|url|max:500',
        ]);

        $settings = AppSettings::first();
        
        if ($settings) {
            $settings->update($validated);
        } else {
            $settings = AppSettings::create($validated);
        }

        return response()->json($settings);
    }
}



