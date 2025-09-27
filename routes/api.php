<?php

// Get all services for a country
Route::get('/country/{countryId}/services', function ($countryId) {
    return \App\Models\Service::with(['provider', 'serviceType', 'country', 'theme'])
        ->where('country_id', $countryId)
        ->get();
});

// Get all services for a theme
Route::get('/theme/{themeId}/services', function ($themeId) {
    $providerIds = \DB::table('provider_theme')
        ->where('theme_id', $themeId)
        ->pluck('service_provider_id');
    return \App\Models\Service::with(['provider', 'serviceType', 'country', 'theme'])
        ->whereIn('provider_id', $providerIds)
        ->get();
});

// Get all services for a service type in a country
Route::get('/country/{countryId}/service-type/{typeId}/services', function ($countryId, $typeId) {
    return \App\Models\Service::with(['provider', 'serviceType', 'country', 'theme'])
        ->where('country_id', $countryId)
        ->where('service_type_id', $typeId)
        ->get();
});

// Get all services for a service type in a theme
Route::get('/theme/{themeId}/service-type/{typeId}/services', function ($themeId, $typeId) {
    $providerIds = \DB::table('provider_theme')
        ->where('theme_id', $themeId)
        ->pluck('service_provider_id');
    return \App\Models\Service::with(['provider', 'serviceType', 'country', 'theme'])
        ->whereIn('provider_id', $providerIds)
        ->where('service_type_id', $typeId)
        ->get();
});

// Service management for providers
use App\Http\Controllers\ServiceController;
Route::get('/provider/services', [ServiceController::class, 'index']);
Route::post('/provider/services', [ServiceController::class, 'store']);

use Illuminate\Support\Facades\Hash;
// Service Provider Login
Route::post('/service-provider-login', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required|string',
    ]);
    $provider = \App\Models\ServiceProvider::with(['serviceTypes', 'country'])->where('email', strtolower($request->email))->first();
    if (!$provider || !$provider->is_approved) {
        return response()->json(['error' => 'Invalid credentials or not approved.'], 401);
    }
    if (!Hash::check($request->password, $provider->password)) {
        return response()->json(['error' => 'Invalid credentials.'], 401);
    }
    // Return provider info with relationships for dashboard
    return response()->json([
        'message' => 'Login successful',
        'provider' => $provider
    ]);
});

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// Service Types (all)
Route::get('/service-types', function () {
    return \App\Models\ServiceType::all();
});

// Service Types for a specific provider
Route::get('/provider/{providerId}/service-types', function ($providerId) {
    $provider = \App\Models\ServiceProvider::with('serviceTypes')->findOrFail($providerId);
    return $provider->serviceTypes;
});

// API Routes for React Admin
// Countries
use App\Http\Controllers\Admin\CountryController;
use App\Http\Controllers\Admin\ThemeController;

Route::get('/countries', function () {
    return \App\Models\Country::withCount('serviceProviders')->get();
});
Route::post('/countries', [CountryController::class, 'store']);
Route::put('/countries/{country}', [CountryController::class, 'update']);
Route::delete('/countries/{country}', function (\App\Models\Country $country) {
    $country->delete();
    return response()->json(['message' => 'Country deleted successfully']);
});

// Themes
Route::get('/themes', function () {
    return \App\Models\Theme::withCount('serviceProviders')->get();
});
Route::post('/themes', [ThemeController::class, 'store']);
Route::put('/themes/{theme}', [ThemeController::class, 'update']);
Route::delete('/themes/{theme}', function (\App\Models\Theme $theme) {
    $theme->delete();
    return response()->json(['message' => 'Theme deleted successfully']);
});

// Service Providers
Route::get('/service-providers', function () {
    return \App\Models\ServiceProvider::with(['country', 'themes', 'serviceTypes'])->get();
});
Route::post('/service-providers', function (\Illuminate\Http\Request $request) {
    \Log::info('ServiceProvider create request', $request->all());
    try {
        $request->merge([
            'email' => $request->email ? strtolower($request->email) : null,
        ]);

        $validated = $request->validate([
            'country_id' => 'required|exists:countries,id',
            'service_type_ids' => 'required|array|min:1',
            'service_type_ids.*' => 'exists:service_types,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_range' => 'required|in:$,$$,$$$,$$$$',
            'website' => 'nullable|url|unique:service_providers,website',
            'email' => ['nullable','email','regex:/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/','unique:service_providers,email'],
            'phone' => 'nullable|string|unique:service_providers,phone',
            'is_approved' => 'boolean',
            'themes' => 'array',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'documents' => 'nullable|array',
            'documents.*' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:4096',
        ], [
            'email.unique' => 'This email is already registered.',
            'phone.unique' => 'This phone number is already registered.',
            'website.unique' => 'This website is already registered.',
        ]);

        $data = $request->except(['themes', 'image', 'documents', 'service_type_ids']);

        // Always set status to pending for user submissions
        $data['status'] = 'pending';

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

        // If is_approved is true, generate password and send approval email
        $password = null;
        if (isset($data['is_approved']) && $data['is_approved']) {
            $password = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 8);
            $data['password'] = \Illuminate\Support\Facades\Hash::make($password);
        }

        $serviceProvider = \App\Models\ServiceProvider::create($data);
        // Attach multiple service types
        if ($request->has('service_type_ids')) {
            $serviceProvider->serviceTypes()->sync($request->input('service_type_ids'));
        }
        if ($request->has('themes')) {
            $serviceProvider->themes()->attach($request->themes);
        }

        // Send approval email if approved
        if ($password && $serviceProvider->email) {
            \Illuminate\Support\Facades\Mail::to($serviceProvider->email)->send(new \App\Mail\ServiceProviderStatusMail('approved', $password));
        }

        // Send pending email to user if not approved (user-side submission)
        if ((!isset($data['is_approved']) || !$data['is_approved']) && $serviceProvider->email) {
            \Illuminate\Support\Facades\Mail::to($serviceProvider->email)->send(new \App\Mail\ServiceProviderPendingMail($serviceProvider->name));
        }

        return response()->json($serviceProvider->load(['country', 'themes']), 201);
    } catch (\Illuminate\Validation\ValidationException $e) {
        // Return validation errors in standard format
        return response()->json([
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        \Log::error('ServiceProvider create error: ' . $e->getMessage());
        return response()->json([
            'errors' => [
                'general' => [$e->getMessage()]
            ]
        ], 422);
    }
});
Route::put('/service-providers/{serviceProvider}', function (\App\Models\ServiceProvider $serviceProvider, \Illuminate\Http\Request $request) {
    $request->merge([
        'email' => $request->email ? strtolower($request->email) : null,
    ]);

    $request->validate([
        'country_id' => 'required|exists:countries,id',
        'service_type_ids' => 'required|array|min:1',
        'service_type_ids.*' => 'exists:service_types,id',
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price_range' => 'required|in:$,$$,$$$,$$$$',
        'website' => 'nullable|url|unique:service_providers,website,' . $serviceProvider->id,
        'email' => ['nullable','email','regex:/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/','unique:service_providers,email,' . $serviceProvider->id],
        'phone' => 'nullable|string|unique:service_providers,phone,' . $serviceProvider->id,
        'is_approved' => 'boolean',
        'themes' => 'array',
        'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        'documents.*' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:4096',
    ], [
        'email.unique' => 'This email is already registered.',
        'phone.unique' => 'This phone number is already registered.',
        'website.unique' => 'This website is already registered.',
    ]);

    $data = $request->except(['themes', 'image', 'documents', 'service_type_ids']);

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
    // Sync multiple service types
    if ($request->has('service_type_ids')) {
        $serviceProvider->serviceTypes()->sync($request->input('service_type_ids'));
    }
    if ($request->has('themes')) {
        $serviceProvider->themes()->sync($request->themes);
    }

    return response()->json($serviceProvider->load(['country', 'themes']));
});
Route::delete('/service-providers/{serviceProvider}', function (\App\Models\ServiceProvider $serviceProvider) {
    $serviceProvider->delete();
    return response()->json(['message' => 'Service Provider deleted successfully']);
});
use App\Http\Controllers\Admin\ServiceProviderController;

Route::patch('/service-providers/{serviceProvider}/approve', [ServiceProviderController::class, 'approve']);
Route::patch('/service-providers/{serviceProvider}/reject', [ServiceProviderController::class, 'reject']);