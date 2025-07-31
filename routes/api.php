<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// API Routes for React Admin
// Countries
Route::get('/countries', function () {
    return \App\Models\Country::withCount('serviceProviders')->get();
});
Route::post('/countries', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'slug' => 'required|string|max:255|unique:countries',
        'description' => 'nullable|string',
        'lat' => 'nullable|numeric',
        'lng' => 'nullable|numeric',
    ]);
    
    $country = \App\Models\Country::create($request->all());
    return response()->json($country, 201);
});
Route::put('/countries/{country}', function (\App\Models\Country $country, \Illuminate\Http\Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'slug' => 'required|string|max:255|unique:countries,slug,' . $country->id,
        'description' => 'nullable|string',
        'lat' => 'nullable|numeric',
        'lng' => 'nullable|numeric',
    ]);
    
    $country->update($request->all());
    return response()->json($country);
});
Route::delete('/countries/{country}', function (\App\Models\Country $country) {
    $country->delete();
    return response()->json(['message' => 'Country deleted successfully']);
});

// Themes
Route::get('/themes', function () {
    return \App\Models\Theme::withCount('serviceProviders')->get();
});
Route::post('/themes', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
    ]);
    
    $theme = \App\Models\Theme::create($request->all());
    return response()->json($theme, 201);
});
Route::put('/themes/{theme}', function (\App\Models\Theme $theme, \Illuminate\Http\Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
    ]);
    
    $theme->update($request->all());
    return response()->json($theme);
});
Route::delete('/themes/{theme}', function (\App\Models\Theme $theme) {
    $theme->delete();
    return response()->json(['message' => 'Theme deleted successfully']);
});

// Service Providers
Route::get('/service-providers', function () {
    return \App\Models\ServiceProvider::with(['country', 'themes'])->get();
});
Route::post('/service-providers', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'country_id' => 'required|exists:countries,id',
        'name' => 'required|string|max:255',
        'type' => 'required|in:accommodation,restaurant,tour_operator,volunteering,activity',
        'description' => 'nullable|string',
        'price_range' => 'nullable|string|max:255',
        'website' => 'nullable|url',
        'email' => 'nullable|email',
        'phone' => 'nullable|string',
        'lat' => 'nullable|numeric',
        'lng' => 'nullable|numeric',
        'is_approved' => 'boolean',
        'themes' => 'array',
    ]);
    
    $serviceProvider = \App\Models\ServiceProvider::create($request->except('themes'));
    
    if ($request->has('themes')) {
        $serviceProvider->themes()->attach($request->themes);
    }
    
    return response()->json($serviceProvider->load(['country', 'themes']), 201);
});
Route::put('/service-providers/{serviceProvider}', function (\App\Models\ServiceProvider $serviceProvider, \Illuminate\Http\Request $request) {
    $request->validate([
        'country_id' => 'required|exists:countries,id',
        'name' => 'required|string|max:255',
        'type' => 'required|in:accommodation,restaurant,tour_operator,volunteering,activity',
        'description' => 'nullable|string',
        'price_range' => 'nullable|string|max:255',
        'website' => 'nullable|url',
        'email' => 'nullable|email',
        'phone' => 'nullable|string',
        'lat' => 'nullable|numeric',
        'lng' => 'nullable|numeric',
        'is_approved' => 'boolean',
        'themes' => 'array',
    ]);
    
    $serviceProvider->update($request->except('themes'));
    
    if ($request->has('themes')) {
        $serviceProvider->themes()->sync($request->themes);
    }
    
    return response()->json($serviceProvider->load(['country', 'themes']));
});
Route::delete('/service-providers/{serviceProvider}', function (\App\Models\ServiceProvider $serviceProvider) {
    $serviceProvider->delete();
    return response()->json(['message' => 'Service Provider deleted successfully']);
});
Route::patch('/service-providers/{serviceProvider}/toggle-approval', function (\App\Models\ServiceProvider $serviceProvider) {
    $serviceProvider->update(['is_approved' => !$serviceProvider->is_approved]);
    return response()->json($serviceProvider);
}); 