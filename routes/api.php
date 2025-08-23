<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// Service Types
Route::get('/service-types', function () {
    return \App\Models\ServiceType::all();
});

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
    ]);
    
    $country = \App\Models\Country::create($request->all());
    return response()->json($country, 201);
});
Route::put('/countries/{country}', function (\App\Models\Country $country, \Illuminate\Http\Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'slug' => 'required|string|max:255|unique:countries,slug,' . $country->id,
        'description' => 'nullable|string',
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
    try {
        $request->merge([
            'email' => $request->email ? strtolower($request->email) : null,
        ]);

        $validated = $request->validate([
            'country_id' => 'required|exists:countries,id',
            'service_type_id' => 'required|exists:service_types,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_range' => 'required|in:$,$$,$$$,$$$$',
            'website' => 'nullable|url',
            'email' => ['nullable','email','regex:/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/'],
            'phone' => 'nullable|string',
            'is_approved' => 'boolean',
            'themes' => 'array',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'documents.*' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:4096',
        ]);

        $data = $request->except(['themes', 'image', 'documents']);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('uploads/service_provider_images', 'public');
            $data['image'] = $imagePath;
        }

        // Handle documents upload
        $documentPaths = [];
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $doc) {
                $documentPaths[] = $doc->store('uploads/service_provider_documents', 'public');
            }
            $data['documents'] = $documentPaths;
        }

        $serviceProvider = \App\Models\ServiceProvider::create($data);

        if ($request->has('themes')) {
            $serviceProvider->themes()->attach($request->themes);
        }

        return response()->json($serviceProvider->load(['country', 'themes']), 201);
    } catch (\Exception $e) {
        \Log::error('ServiceProvider create error: ' . $e->getMessage());
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ], 422);
    }
});
Route::put('/service-providers/{serviceProvider}', function (\App\Models\ServiceProvider $serviceProvider, \Illuminate\Http\Request $request) {
    $request->merge([
        'email' => $request->email ? strtolower($request->email) : null,
    ]);

    $request->validate([
        'country_id' => 'required|exists:countries,id',
        'service_type_id' => 'required|exists:service_types,id',
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price_range' => 'required|in:$,$$,$$$,$$$$',
        'website' => 'nullable|url',
        'email' => ['nullable','email','regex:/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/'],
        'phone' => 'nullable|string',
        'is_approved' => 'boolean',
        'themes' => 'array',
        'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        'documents.*' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:4096',
    ]);

    $data = $request->except(['themes', 'image', 'documents']);

    // Handle image upload
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('uploads/service_provider_images', 'public');
        $data['image'] = $imagePath;
    }

    // Handle documents upload
    $documentPaths = [];
    if ($request->hasFile('documents')) {
        foreach ($request->file('documents') as $doc) {
            $documentPaths[] = $doc->store('uploads/service_provider_documents', 'public');
        }
        $data['documents'] = $documentPaths;
    }

    $serviceProvider->update($data);

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