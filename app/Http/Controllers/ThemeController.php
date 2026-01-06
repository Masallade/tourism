<?php

namespace App\Http\Controllers;

use App\Models\Theme;
use App\Traits\TranslatableResponse;
use Illuminate\Http\Request;

class ThemeController extends Controller
{
    use TranslatableResponse;
    
    public function index(Request $request)
    {
        // Set locale from request
        $locale = $request->header('Accept-Language', 'en');
        $locale = $request->query('locale', $locale);
        
        if (in_array($locale, ['en', 'es', 'fr'])) {
            app()->setLocale($locale);
        }
        
        $themes = Theme::withCount('serviceProviders')->get();
        
        // Models now handle translations directly via getNameAttribute accessor
        return response()->json($themes);
    }
    
    public function show($id, Request $request)
    {
        $locale = $request->header('Accept-Language', 'en');
        $locale = $request->query('locale', $locale);
        
        if (in_array($locale, ['en', 'es', 'fr'])) {
            app()->setLocale($locale);
        }
        
        $theme = Theme::withCount('serviceProviders')->findOrFail($id);
        
        // Model now handles translation directly via getNameAttribute accessor
        return response()->json($theme);
    }
    
    public function showBySlug($slug, Request $request)
    {
        $locale = $request->header('Accept-Language', 'en');
        $locale = $request->query('locale', $locale);
        
        if (in_array($locale, ['en', 'es', 'fr'])) {
            app()->setLocale($locale);
        }
        
        $theme = Theme::withCount('serviceProviders')
            ->where('slug', $slug)
            ->firstOrFail();
        
        // Model now handles translation directly via getNameAttribute accessor
        return response()->json($theme);
    }
}








