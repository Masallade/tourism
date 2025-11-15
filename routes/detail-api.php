<?php

use App\Models\Country;
use App\Models\Theme;
use Illuminate\Support\Facades\Route;

// Existing API endpoints

// New endpoints for detail pages

// Get a single country by ID with provider count
Route::get('/countries/{id}', function ($id) {
    return Country::withCount('serviceProviders')
        ->with(['serviceProviders' => function ($query) {
            $query->limit(5); // Only get first 5 providers for preview
        }])
        ->findOrFail($id);
});

// Get a single theme by ID with provider count
Route::get('/themes/{id}', function ($id) {
    return Theme::withCount('serviceProviders')
        ->with(['serviceProviders' => function ($query) {
            $query->limit(5); // Only get first 5 providers for preview
        }])
        ->findOrFail($id);
});

// Get all services for a specific country with service type, theme, and provider details
Route::get('/country/{countryId}/services', function ($countryId) {
    return \App\Models\Service::with(['provider', 'serviceTypes', 'country', 'theme', 'themes'])
        ->where('country_id', $countryId)
        ->get();
});

// Get all services for a specific theme with service type, country, and provider details
Route::get('/theme/{themeId}/services', function ($themeId) {
    return \App\Models\Service::with(['provider', 'serviceTypes', 'country', 'theme', 'themes'])
        ->where('theme_id', $themeId)
        ->get();
});

// Get all service types with their counts
Route::get('/service-types-with-count', function () {
    return \App\Models\ServiceType::withCount('services')->get();
});