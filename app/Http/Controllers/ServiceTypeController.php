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
        
        // Include count of service providers for each service type
        $serviceTypes = ServiceType::withCount('serviceProviders')->get();
        
        // Models now handle translations directly via getNameAttribute accessor
        return response()->json($serviceTypes);
    }
    
    public function show($id, Request $request)
    {
        $locale = $request->header('Accept-Language', 'en');
        $locale = $request->query('locale', $locale);
        
        if (in_array($locale, ['en', 'es', 'fr'])) {
            app()->setLocale($locale);
        }
        
        $serviceType = ServiceType::findOrFail($id);
        
        // Model now handles translation directly via getNameAttribute accessor
        return response()->json($serviceType);
    }
}





