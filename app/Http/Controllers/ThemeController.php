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
        $locale = $request->header('Accept-Language', 'en');
        $locale = $request->query('locale', $locale);
        if (in_array($locale, ['en', 'es', 'fr'])) {
            app()->setLocale($locale);
        }

        $perPage = $request->query('per_page');
        $page = $request->query('page');
        if ($perPage !== null || $page !== null) {
            $perPage = max(1, min(50, (int) ($perPage ?: 12)));
            $themes = Theme::withCount('serviceProviders')->orderBy('name')->paginate($perPage);
            return response()->json([
                'data' => $themes->items(),
                'total' => $themes->total(),
                'per_page' => $themes->perPage(),
                'current_page' => $themes->currentPage(),
                'last_page' => $themes->lastPage(),
            ]);
        }

        $themes = Theme::withCount('serviceProviders')->orderBy('name')->get();
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








