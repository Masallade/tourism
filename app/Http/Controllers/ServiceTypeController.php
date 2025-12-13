<?php

namespace App\Http\Controllers;

use App\Models\ServiceType;
use App\Traits\TranslatableResponse;
use Illuminate\Http\Request;

class ServiceTypeController extends Controller
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
        
        $serviceTypes = ServiceType::all();
        
        // Translate translatable fields
        $translated = $this->translateCollection($serviceTypes, [
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
        
        $serviceType = ServiceType::findOrFail($id);
        
        $translated = $this->translateModel($serviceType, [
            'name'
        ]);
        
        return response()->json($translated);
    }
}





