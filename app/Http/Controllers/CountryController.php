<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Traits\TranslatableResponse;
use Illuminate\Http\Request;

class CountryController extends Controller
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
        
        $countries = Country::withCount('serviceProviders')->get();
        
        // Translate translatable fields
        $translated = $this->translateCollection($countries, [
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
        
        $country = Country::withCount('serviceProviders')->findOrFail($id);
        
        $translated = $this->translateModel($country, [
            'name',
            'description'
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
        
        $country = Country::withCount('serviceProviders')
            ->where('slug', $slug)
            ->firstOrFail();
        
        $translated = $this->translateModel($country, [
            'name',
            'description'
        ]);
        
        return response()->json($translated);
    }
}








