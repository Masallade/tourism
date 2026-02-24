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
        $locale = $request->header('Accept-Language', 'en');
        $locale = $request->query('locale', $locale);
        if (in_array($locale, ['en', 'es', 'fr'])) {
            app()->setLocale($locale);
        }

        $perPage = $request->query('per_page');
        $page = $request->query('page');
        if ($perPage !== null || $page !== null) {
            $perPage = max(1, min(50, (int) ($perPage ?: 12)));
            $countries = Country::withCount('serviceProviders')->orderBy('name')->paginate($perPage);
            $translated = $this->translateCollection($countries->getCollection(), ['name', 'description']);
            $countries->setCollection(collect($translated));
            return response()->json([
                'data' => $countries->items(),
                'total' => $countries->total(),
                'per_page' => $countries->perPage(),
                'current_page' => $countries->currentPage(),
                'last_page' => $countries->lastPage(),
            ]);
        }

        $countries = Country::withCount('serviceProviders')->orderBy('name')->get();
        $translated = $this->translateCollection($countries, ['name', 'description']);
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








