<?php

namespace App\Http\Controllers;

use App\Models\ServiceProvider;
use App\Traits\TranslatableResponse;
use Illuminate\Http\Request;

class ServiceProviderController extends Controller
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
        
        $providers = ServiceProvider::with(['country', 'themes', 'serviceTypes'])->get();
        
        // Translate translatable fields
        $translated = $this->translateCollection($providers, [
            'name',
            'description'
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
        
        $provider = ServiceProvider::with(['country', 'themes', 'serviceTypes'])->findOrFail($id);
        
        $translated = $this->translateModel($provider, [
            'name',
            'description'
        ]);
        
        return response()->json($translated);
    }
}








