<?php
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ServiceProviderPasswordController;
use App\Http\Controllers\ServiceController;
use App\Helpers\ImageProcessor;
use Illuminate\Support\Facades\Storage;

// Service Provider Change Password API
Route::post('/service-provider/change-password', [ServiceProviderPasswordController::class, 'change']);
// Service Provider password change

// Get all users (for admin dashboard)
Route::get('/users', function () {
    return \App\Models\User::select('id', 'name', 'email', 'role', 'created_at')
        ->orderBy('created_at', 'desc')
        ->get();
});

// Get all services for a country (with translation)
Route::get('/country/{countryId}/services', [ServiceController::class, 'getByCountry']);

// Get all services for a theme (with translation)
Route::get('/theme/{themeId}/services', [ServiceController::class, 'getByTheme']);
        
// Get all services (must be before /services/{id} to avoid route conflict)
Route::get('/services/all', [ServiceController::class, 'all']);

// Get single service (with translation)
Route::get('/services/{id}', [ServiceController::class, 'show']);

// Get a single country by ID with provider count
Route::get('/countries/{id}', function ($id) {
    $country = \App\Models\Country::withCount('serviceProviders')
        ->findOrFail($id);
    
    // Log the fields to understand what data we have
    \Log::info('Country data for ID '.$id, [
        'id' => $country->id,
        'name' => $country->name,
        'image_url' => $country->image_url,
        'has_image_url' => !empty($country->image_url),
        'cover_image' => $country->cover_image,
    ]);
    
    return $country;
});

// Get a single theme by ID with provider count
Route::get('/themes/{id}', function ($id) {
    return \App\Models\Theme::withCount('serviceProviders')->findOrFail($id);
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


// Service management for providers (no auth for local testing)
Route::get('/provider/services', [ServiceController::class, 'index']);
Route::post('/provider/services', [ServiceController::class, 'store']);
Route::put('/provider/services/{id}', [ServiceController::class, 'update']);
Route::delete('/provider/services/{id}', [ServiceController::class, 'destroy']);

// Booking feature - COMMENTED OUT
// Route::post('/services/{service}/bookings', [BookingController::class, 'store']);

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
// Import controllers
use App\Http\Controllers\ServiceTypeController;
use App\Http\Controllers\Admin\ServiceTypeController as AdminServiceTypeController;

// Public Service Type routes with translation
Route::get('/service-types', [ServiceTypeController::class, 'index']);
Route::get('/service-types/{id}', [ServiceTypeController::class, 'show']);

// Old route (keeping for backward compatibility, but will use controller)
Route::get('/service-types-old', function () {
    return \App\Models\ServiceType::withCount('serviceProviders')->get();
});

// Service Types for a specific provider
Route::get('/provider/{providerId}/service-types', function ($providerId) {
    $provider = \App\Models\ServiceProvider::with('serviceTypes')->findOrFail($providerId);
    return $provider->serviceTypes;
});

// Service Types CRUD for admin
Route::post('/service-types', [AdminServiceTypeController::class, 'store'])->middleware('admin.auth');
Route::put('/service-types/{serviceType}', [AdminServiceTypeController::class, 'update'])->middleware('admin.auth');
Route::delete('/service-types/{serviceType}', function (\App\Models\ServiceType $serviceType) {
    $serviceType->delete();
    return response()->json(['message' => 'Service Type deleted successfully']);
})->middleware('admin.auth');

// App Settings - Public read, Admin write
use App\Http\Controllers\Admin\AppSettingsController;
Route::get('/app-settings', [AppSettingsController::class, 'index']);
Route::post('/app-settings', [AppSettingsController::class, 'store'])->middleware('admin.auth');

// About Page - Public read, Admin write
use App\Http\Controllers\Admin\AboutPageController;
Route::get('/about-page', [AboutPageController::class, 'index']);
Route::post('/about-page', [AboutPageController::class, 'store'])->middleware('admin.auth');

// API Routes for React Admin
// Countries
use App\Http\Controllers\Admin\CountryController as AdminCountryController;
use App\Http\Controllers\Admin\ThemeController as AdminThemeController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\ThemeController;
use App\Http\Controllers\ServiceProviderController;
use App\Http\Controllers\DestinationController;
use App\Http\Middleware\AdminAuth;

// Public Country routes with translation
Route::get('/countries', [CountryController::class, 'index']);
Route::get('/countries/{id}', [CountryController::class, 'show']);
Route::get('/countries/slug/{slug}', [CountryController::class, 'showBySlug']);
// Admin Country routes
Route::post('/countries', [AdminCountryController::class, 'store'])->middleware('admin.auth');
Route::put('/countries/{country}', [AdminCountryController::class, 'update'])->middleware('admin.auth');
Route::post('/countries/{country}/update', [AdminCountryController::class, 'update'])->middleware('admin.auth'); // For FormData updates
Route::delete('/countries/{country}', function (\App\Models\Country $country) {
    // Check if country has any service providers
    $serviceProviderCount = $country->serviceProviders()->count();
    
    if ($serviceProviderCount > 0) {
        return response()->json([
            'error' => 'Cannot delete country',
            'message' => "This country cannot be deleted because it has {$serviceProviderCount} service provider(s) associated with it. Please remove or reassign all service providers before deleting this country."
        ], 422);
    }
    
    $country->delete();
    return response()->json(['message' => 'Country deleted successfully']);
})->middleware('admin.auth');

// Public Theme routes with translation
Route::get('/themes', [ThemeController::class, 'index']);
Route::get('/themes/{id}', [ThemeController::class, 'show']);
Route::get('/themes/slug/{slug}', [ThemeController::class, 'showBySlug']);

// Admin Theme routes
Route::post('/themes', [AdminThemeController::class, 'store'])->middleware('admin.auth');
Route::put('/themes/{theme}', [AdminThemeController::class, 'update'])->middleware('admin.auth');
Route::post('/themes/{theme}/update', [AdminThemeController::class, 'update'])->middleware('admin.auth'); // For FormData updates
Route::delete('/themes/{theme}', function (\App\Models\Theme $theme) {
    $theme->delete();
    return response()->json(['message' => 'Theme deleted successfully']);
})->middleware('admin.auth');

// Public Service Provider routes with translation
Route::get('/service-providers', [ServiceProviderController::class, 'index']);
Route::get('/service-providers/{id}', [ServiceProviderController::class, 'show']);
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
            'description' => 'nullable|string|max:20000',
            'price_range' => 'required|in:$,$$,$$$,$$$$',
            'website' => 'nullable|url|unique:service_providers,website',
            'email' => ['nullable','email','regex:/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/','unique:service_providers,email'],
            'phone' => 'nullable|string|unique:service_providers,phone',
            'country_code' => 'nullable|string|max:10',
            'is_approved' => 'boolean',
            'themes' => 'array',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'documents' => 'nullable|array',
            'documents.*' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:10240',
        ], [
            'email.unique' => 'This email is already registered.',
            'phone.unique' => 'This phone number is already registered.',
            'website.unique' => 'This website is already registered.',
        ]);

        $data = $request->except(['themes', 'image', 'documents', 'service_type_ids']);

        // Always set is_approved to false for user submissions (pending approval)
        $data['is_approved'] = false;

        // Handle image upload
        if ($request->hasFile('image')) {
            try {
                $file = $request->file('image');
                $imagePath = ImageProcessor::processAndStore($file, 'service_provider', 'uploads/service_provider_images');
                $data['image'] = $imagePath;
            } catch (\Exception $e) {
                \Log::error('Service provider image processing failed: ' . $e->getMessage());
                // Fallback to original upload method
                $imagePath = $request->file('image')->store('uploads/service_provider_images', 'public');
                $data['image'] = $imagePath;
            }
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
            // Generate random 8-character password (letters + numbers) - COMMENTED OUT
            // $password = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 8);
            // Fixed password for all service providers
            $password = '12345678';
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
        // In production, queue to avoid blocking. In local, send synchronously for testing.
        if ($password && $serviceProvider->email) {
            \Log::info('ServiceProvider: Attempting to send approval email', [
                'email' => $serviceProvider->email,
                'environment' => app()->environment(),
                'mail_mailer' => config('mail.default'),
            ]);
            
            try {
                if (app()->environment('production')) {
                    \Log::info('ServiceProvider: Queueing approval email (production)');
                    \Illuminate\Support\Facades\Mail::to($serviceProvider->email)->queue(new \App\Mail\ServiceProviderStatusMail('approved', $password));
                    \Log::info('ServiceProvider: Approval email queued successfully');
                } else {
                    \Log::info('ServiceProvider: Sending approval email synchronously (local)');
                    \Illuminate\Support\Facades\Mail::to($serviceProvider->email)->send(new \App\Mail\ServiceProviderStatusMail('approved', $password));
                    \Log::info('ServiceProvider: Approval email sent successfully');
                }
            } catch (\Exception $e) {
                \Log::error('ServiceProvider: Failed to send approval email', [
                    'error' => $e->getMessage(),
                    'email' => $serviceProvider->email,
                    'trace' => $e->getTraceAsString()
                ]);
            }
        }

        // Send pending email to user if not approved (user-side submission)
        // In production, queue to avoid blocking. In local, send synchronously for testing.
        if ((!isset($data['is_approved']) || !$data['is_approved']) && $serviceProvider->email) {
            \Log::info('ServiceProvider: Attempting to send pending email', [
                'email' => $serviceProvider->email,
                'name' => $serviceProvider->name,
                'environment' => app()->environment(),
                'mail_mailer' => config('mail.default'),
            ]);
            
            try {
                if (app()->environment('production')) {
                    \Log::info('ServiceProvider: Queueing pending email (production)');
                    \Illuminate\Support\Facades\Mail::to($serviceProvider->email)->queue(new \App\Mail\ServiceProviderPendingMail($serviceProvider->name));
                    \Log::info('ServiceProvider: Pending email queued successfully');
                } else {
                    \Log::info('ServiceProvider: Sending pending email synchronously (local)');
                    \Illuminate\Support\Facades\Mail::to($serviceProvider->email)->send(new \App\Mail\ServiceProviderPendingMail($serviceProvider->name));
                    \Log::info('ServiceProvider: Pending email sent successfully');
                }
            } catch (\Exception $e) {
                \Log::error('ServiceProvider: Failed to send pending email', [
                    'error' => $e->getMessage(),
                    'email' => $serviceProvider->email,
                    'trace' => $e->getTraceAsString()
                ]);
            }
        } else {
            \Log::info('ServiceProvider: Skipping pending email', [
                'is_approved' => $data['is_approved'] ?? 'not set',
                'has_email' => !empty($serviceProvider->email),
            ]);
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
    // Debug: Log what we're receiving
    \Log::info('ServiceProvider update request received', [
        'all_input' => $request->all(),
        'service_type_ids_raw' => $request->input('service_type_ids'),
        'service_type_ids_array' => $request->input('service_type_ids', []),
        'has_service_type_ids' => $request->has('service_type_ids'),
        'request_method' => $request->method(),
        'content_type' => $request->header('Content-Type'),
    ]);
    
    $request->merge([
        'email' => $request->email ? strtolower($request->email) : null,
    ]);

    // Get service_type_ids - handle FormData array format (service_type_ids[])
    // Laravel should parse service_type_ids[] automatically, but with PUT + FormData it might not
    $allInput = $request->all();
    $serviceTypeIds = [];
    
    // Try multiple ways to get the array
    if ($request->has('service_type_ids') && is_array($request->input('service_type_ids'))) {
        $serviceTypeIds = $request->input('service_type_ids');
    } elseif (isset($allInput['service_type_ids']) && is_array($allInput['service_type_ids'])) {
        $serviceTypeIds = $allInput['service_type_ids'];
    } else {
        // Check if it's in the raw input (for FormData arrays)
        $rawInput = $request->input();
        if (isset($rawInput['service_type_ids']) && is_array($rawInput['service_type_ids'])) {
            $serviceTypeIds = $rawInput['service_type_ids'];
        }
    }
    
    // Ensure it's an array of integers
    $serviceTypeIds = array_filter(array_map('intval', (array)$serviceTypeIds));
    
    \Log::info('Processed service_type_ids', [
        'service_type_ids' => $serviceTypeIds,
        'count' => count($serviceTypeIds),
    ]);
    
    // Merge service_type_ids back into request for validation
    // If we couldn't find any, validation will catch it
    $request->merge(['service_type_ids' => $serviceTypeIds]);

    $request->validate([
        'country_id' => 'required|exists:countries,id',
        'service_type_ids' => 'required|array|min:1',
        'service_type_ids.*' => 'required|exists:service_types,id',
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price_range' => 'required|in:$,$$,$$$,$$$$',
        'website' => 'nullable|url|unique:service_providers,website,' . $serviceProvider->id,
        'email' => ['nullable','email','regex:/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/','unique:service_providers,email,' . $serviceProvider->id],
        'phone' => 'nullable|string|unique:service_providers,phone,' . $serviceProvider->id,
        'country_code' => 'nullable|string|max:10',
        'is_approved' => 'boolean',
        'themes' => 'array',
        'image' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
        'documents.*' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:10240',
    ], [
        'email.unique' => 'This email is already registered.',
        'phone.unique' => 'This phone number is already registered.',
        'website.unique' => 'This website is already registered.',
    ]);

    $data = $request->except(['themes', 'image', 'documents', 'service_type_ids']);

    // Handle image upload
    if ($request->hasFile('image')) {
        try {
            $file = $request->file('image');
            $imagePath = ImageProcessor::processAndStore($file, 'service_provider', 'uploads/service_provider_images');
            $data['image'] = $imagePath;
        } catch (\Exception $e) {
            \Log::error('Service provider image processing failed: ' . $e->getMessage());
            // Fallback to original upload method
        $imagePath = $request->file('image')->store('uploads/service_provider_images', 'public');
        $data['image'] = $imagePath;
        }
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
    // Sync multiple service types - use the processed array
    if (!empty($serviceTypeIds)) {
        $serviceProvider->serviceTypes()->sync($serviceTypeIds);
    }
    if ($request->has('themes')) {
        $themes = $request->input('themes', []);
        if (!is_array($themes)) {
            $themes = [$themes];
        }
        $serviceProvider->themes()->sync(array_filter(array_map('intval', $themes)));
    }

    return response()->json($serviceProvider->load(['country', 'themes', 'serviceTypes']));
})->middleware('admin.auth');

// POST route for FormData updates (more reliable for file uploads and arrays)
Route::post('/service-providers/{serviceProvider}/update', function (\App\Models\ServiceProvider $serviceProvider, \Illuminate\Http\Request $request) {
    // Debug: Log what we're receiving
    \Log::info('ServiceProvider update request received (POST)', [
        'all_input' => $request->all(),
        'service_type_ids_raw' => $request->input('service_type_ids'),
        'service_type_ids_array' => $request->input('service_type_ids', []),
        'has_service_type_ids' => $request->has('service_type_ids'),
        'request_method' => $request->method(),
        'content_type' => $request->header('Content-Type'),
    ]);
    
    $request->merge([
        'email' => $request->email ? strtolower($request->email) : null,
    ]);

    // Get service_type_ids - FormData arrays should be parsed automatically with POST
    $serviceTypeIds = $request->input('service_type_ids', []);
    // Ensure it's an array
    if (!is_array($serviceTypeIds)) {
        $serviceTypeIds = $request->has('service_type_ids') ? [$request->input('service_type_ids')] : [];
    }
    // Ensure it's an array of integers
    $serviceTypeIds = array_filter(array_map('intval', (array)$serviceTypeIds));
    
    \Log::info('Processed service_type_ids (POST)', [
        'service_type_ids' => $serviceTypeIds,
        'count' => count($serviceTypeIds),
    ]);
    
    // Merge service_type_ids back into request for validation
    $request->merge(['service_type_ids' => $serviceTypeIds]);

    $request->validate([
        'country_id' => 'required|exists:countries,id',
        'service_type_ids' => 'required|array|min:1',
        'service_type_ids.*' => 'required|exists:service_types,id',
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price_range' => 'required|in:$,$$,$$$,$$$$',
        'website' => 'nullable|url|unique:service_providers,website,' . $serviceProvider->id,
        'email' => ['nullable','email','regex:/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/','unique:service_providers,email,' . $serviceProvider->id],
        'phone' => 'nullable|string|unique:service_providers,phone,' . $serviceProvider->id,
        'country_code' => 'nullable|string|max:10',
        'is_approved' => 'boolean',
        'themes' => 'array',
        'image' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
        'documents.*' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:10240',
        'lat' => 'nullable|numeric|between:-90,90',
        'lng' => 'nullable|numeric|between:-180,180',
    ], [
        'email.unique' => 'This email is already registered.',
        'phone.unique' => 'This phone number is already registered.',
        'website.unique' => 'This website is already registered.',
    ]);

    $data = $request->except(['themes', 'image', 'documents', 'service_type_ids']);

    // Handle image upload
    if ($request->hasFile('image')) {
        try {
            $file = $request->file('image');
            $imagePath = ImageProcessor::processAndStore($file, 'service_provider', 'uploads/service_provider_images');
            $data['image'] = $imagePath;
        } catch (\Exception $e) {
            \Log::error('Service provider image processing failed: ' . $e->getMessage());
            // Fallback to original upload method
        $imagePath = $request->file('image')->store('uploads/service_provider_images', 'public');
        $data['image'] = $imagePath;
        }
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
    // Sync multiple service types - use the processed array
    if (!empty($serviceTypeIds)) {
        $serviceProvider->serviceTypes()->sync($serviceTypeIds);
    }
    if ($request->has('themes')) {
        $themes = $request->input('themes', []);
        if (!is_array($themes)) {
            $themes = [$themes];
        }
        $serviceProvider->themes()->sync(array_filter(array_map('intval', $themes)));
    }

    return response()->json($serviceProvider->load(['country', 'themes', 'serviceTypes']));
})->middleware('admin.auth');

Route::delete('/service-providers/{serviceProvider}', function (\App\Models\ServiceProvider $serviceProvider) {
    $serviceProvider->delete();
    return response()->json(['message' => 'Service Provider deleted successfully']);
});
use App\Http\Controllers\Admin\ServiceProviderController as AdminServiceProviderController;

Route::patch('/service-providers/{serviceProvider}/approve', [AdminServiceProviderController::class, 'approve']);
Route::patch('/service-providers/{serviceProvider}/reject', [AdminServiceProviderController::class, 'reject']);

// Document view route (placed BEFORE download route to avoid greedy match)
Route::get('/documents/view/{filename}', function ($filename) {
    $path = 'uploads/service_provider_documents/' . $filename;
    
    if (!Storage::disk('public')->exists($path)) {
        abort(404, 'Document not found');
    }
    
    $file = Storage::disk('public')->get($path);
    $mimeType = Storage::disk('public')->mimeType($path);
    
    return response($file, 200)
        ->header('Content-Type', $mimeType)
        ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
})->where('filename', '.*');

// Document download route
Route::get('/documents/{filename}', function ($filename) {
    $path = 'uploads/service_provider_documents/' . $filename;
    
    if (!Storage::disk('public')->exists($path)) {
        abort(404, 'Document not found');
    }
    
    return Storage::disk('public')->download($path);
})->where('filename', '.*');

// AI Assistant
use App\Http\Controllers\AIAssistantController;
Route::post('/ai-chat', [AIAssistantController::class, 'chat']);

// Destinations - Public routes with translation
Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/{id}', [DestinationController::class, 'show']);

// Destinations - Admin routes
use App\Http\Controllers\Admin\DestinationController as AdminDestinationController;

Route::get('/admin/destinations', [AdminDestinationController::class, 'index'])->middleware('admin.auth');

// IMPORTANT: More specific routes must come BEFORE parameterized routes

Route::get('/admin/destinations/services', [AdminDestinationController::class, 'getServices'])->middleware('admin.auth');

Route::post('/admin/destinations', [AdminDestinationController::class, 'store'])->middleware('admin.auth');

// POST update route must come BEFORE the GET/{id} route to avoid route conflicts
Route::post('/admin/destinations/{id}/update', [AdminDestinationController::class, 'update'])->middleware('admin.auth'); // POST route for FormData updates

Route::get('/admin/destinations/{id}', [AdminDestinationController::class, 'show'])->middleware('admin.auth');
Route::put('/admin/destinations/{id}', [AdminDestinationController::class, 'update'])->middleware('admin.auth');
Route::delete('/admin/destinations/{id}', [AdminDestinationController::class, 'destroy'])->middleware('admin.auth');

// Subscriptions - Admin routes
use App\Http\Controllers\Admin\SubscriptionController as AdminSubscriptionController;
use App\Http\Controllers\SubscriptionController;

Route::get('/admin/subscriptions', [AdminSubscriptionController::class, 'index'])->middleware('admin.auth');
Route::post('/admin/subscriptions', [AdminSubscriptionController::class, 'store'])->middleware('admin.auth');
Route::put('/admin/subscriptions/{subscription}', [AdminSubscriptionController::class, 'update'])->middleware('admin.auth');
Route::delete('/admin/subscriptions/{subscription}', [AdminSubscriptionController::class, 'destroy'])->middleware('admin.auth');

// Subscriptions - Public routes
Route::get('/subscriptions', [SubscriptionController::class, 'index']);
Route::get('/subscriptions/{id}', [SubscriptionController::class, 'show']);

// Payment routes
use App\Http\Controllers\PaymentController;
Route::post('/payments/process', [PaymentController::class, 'processPayment']);
Route::get('/payments/history/{serviceProviderId}', [PaymentController::class, 'getPaymentHistory']);