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
        
        // Translate translatable fields
        $translated = $this->translateCollection($themes, [
            'name'
        ]);
        
        return response()->json($translated);
    }
    
    public function show($id, Request $request)
    {
        $locale = $request->header('Accept-Language', 'en');
        $locale = $request->query('locale', $locale);
        
        if (in_array($locale, ['en', 'es', 'fr'])) {
            app()->setLocale($locale);
        }
        
        $theme = Theme::withCount('serviceProviders')->findOrFail($id);
        
        $translated = $this->translateModel($theme, [
            'name'
        ]);
        
        return response()->json($translated);
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
        
        $translated = $this->translateModel($theme, [
            'name'
        ]);
        
        return response()->json($translated);
    }
}





