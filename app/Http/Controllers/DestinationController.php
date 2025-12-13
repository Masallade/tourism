<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Traits\TranslatableResponse;
use Illuminate\Http\Request;

class DestinationController extends Controller
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
        
        try {
            $query = Destination::with(['services.serviceTypes', 'services.themes', 'services.provider', 'services.country', 'country'])
                ->active()
                ->ordered();
            
            // Filter by country if provided
            if ($request->has('country') && $request->country) {
                $countryId = $request->input('country');
                if (is_numeric($countryId)) {
                    $query->where('country_id', (int)$countryId);
                }
            }
            
            $destinations = $query->get();
            
            // Translate translatable fields
            $translated = $this->translateCollection($destinations, [
                'title',
                'subtitle',
                'description'
            ]);
            
            return response()->json($translated);
        } catch (\Exception $e) {
            \Log::error('Error fetching destinations: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            return response()->json(['error' => 'Failed to fetch destinations', 'message' => $e->getMessage()], 500);
        }
    }
    
    public function show($id, Request $request)
    {
        $locale = $request->header('Accept-Language', 'en');
        $locale = $request->query('locale', $locale);
        
        if (in_array($locale, ['en', 'es', 'fr'])) {
            app()->setLocale($locale);
        }
        
        $destination = Destination::with(['services.serviceTypes', 'services.themes', 'services.provider', 'services.country'])
            ->active()
            ->findOrFail($id);
        
        $translated = $this->translateModel($destination, [
            'title',
            'subtitle',
            'description'
        ]);
        
        return response()->json($translated);
    }
}





