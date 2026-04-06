<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\Service;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    /**
     * Get all destinations
     */
    public function index()
    {
        $destinations = Destination::with('services')
            ->ordered()
            ->get();
        
        return response()->json($destinations);
    }

    /**
     * Get a single destination
     */
    public function show($id)
    {
        $destination = Destination::with(['services.serviceTypes', 'services.themes', 'services.provider', 'services.country'])
            ->findOrFail($id);
        
        return response()->json($destination);
    }

    /**
     * Create a new destination
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'subtitle' => 'required|string|max:255',
                'is_active' => 'boolean',
                'display_order' => 'nullable|integer|min:0',
                'service_ids' => 'required|array|min:1',
                'service_ids.*' => 'exists:services,id',
                'country_id' => 'required|exists:countries,id',
                'description' => [
                    'required',
                    'string',
                    function ($attribute, $value, $fail) {
                        $textOnly = strip_tags($value);
                        if (strlen(trim($textOnly)) < 500) {
                            $fail('The description must be at least 500 characters (excluding HTML formatting).');
                        }
                    },
                ],
                'images' => 'nullable|array|max:5',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:15360', // 15MB - will be compressed client-side to ~2MB
                'existing_images' => 'nullable|array',
                'existing_images.*' => 'string',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Destination validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all()
            ]);
            throw $e;
        }

        // Validate that we have at least one image for new destinations
        $hasNewImages = $request->hasFile('images') && count($request->file('images')) > 0;
        if (!$hasNewImages) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'images' => ['At least one image is required.']
            ]);
        }

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = \App\Helpers\ImageProcessor::processAndStore($file, 'destination', 'uploads/destinations');
                $imagePaths[] = $path;
            }
        }

        $destination = Destination::create([
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'display_order' => $validated['display_order'] ?? 0,
            'country_id' => $validated['country_id'],
            'description' => $validated['description'],
            'images' => !empty($imagePaths) ? json_encode($imagePaths) : null,
        ]);

        // Attach services if provided
        if (isset($validated['service_ids']) && is_array($validated['service_ids'])) {
            $destination->services()->sync($validated['service_ids']);
        }

        return response()->json($destination->load('services'), 201);
    }

    /**
     * Update a destination
     */
    public function update(Request $request, $id)
    {
        $destination = Destination::findOrFail($id);

        // Log what we're receiving for debugging
        \Log::info('Destination update request', [
            'id' => $id,
            'title' => $request->input('title'),
            'has_existing_images' => $request->has('existing_images'),
            'existing_images_count' => $request->has('existing_images') ? count($request->input('existing_images', [])) : 0,
            'existing_images' => $request->input('existing_images', []),
            'has_new_images' => $request->hasFile('images'),
            'new_images_count' => $request->hasFile('images') ? count($request->file('images')) : 0,
            'content_type' => $request->header('Content-Type'),
        ]);

        // Custom validation for description (strip HTML tags for length check)
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string|max:255',
            'is_active' => 'boolean',
            'display_order' => 'nullable|integer|min:0',
            'service_ids' => 'required|array|min:1',
            'service_ids.*' => 'exists:services,id',
            'country_id' => 'required|exists:countries,id',
            'description' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    $textOnly = strip_tags($value);
                    if (strlen(trim($textOnly)) < 500) {
                        $fail('The description must be at least 500 characters (excluding HTML formatting).');
                    }
                },
            ],
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:15360', // 15MB - will be compressed client-side to ~2MB
            'existing_images' => 'nullable|array',
            'existing_images.*' => 'string',
        ]);
        
        // Validate that we have at least one image (either new or existing)
        $hasNewImages = $request->hasFile('images') && count($request->file('images')) > 0;
        $hasExistingImages = $request->has('existing_images') && is_array($request->existing_images) && count($request->existing_images) > 0;
        if (!$hasNewImages && !$hasExistingImages) {
            // Check if destination already has images in database
            if ($destination->images) {
                try {
                    $existingImgs = is_array($destination->images) 
                        ? $destination->images 
                        : json_decode($destination->images, true);
                    if (is_array($existingImgs) && count($existingImgs) > 0) {
                        // Destination already has images, so it's okay
                        $hasExistingImages = true;
                    }
                } catch (\Exception $e) {
                    // Ignore parsing errors
                }
            }
            if (!$hasExistingImages) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'images' => ['At least one image is required.']
                ]);
            }
        }

        // Start with existing images from request
        // IMPORTANT: If new images are uploaded AND existing_images is empty/not sent,
        // it means user wants to REPLACE all old images with new ones
        $imagePaths = [];
        $hasNewImages = $request->hasFile('images') && count($request->file('images')) > 0;
        $existingImagesInRequest = $request->input('existing_images', null);
        
        // Check if existing_images was explicitly sent (even if empty array)
        $existingImagesExplicitlySent = $request->has('existing_images');
        
        if ($existingImagesExplicitlySent) {
            // existing_images key exists in request (could be empty array)
            if (is_array($existingImagesInRequest)) {
                $imagePaths = array_values(array_filter($existingImagesInRequest, function($path) {
                    return !empty($path) && is_string($path);
                }));
                \Log::info('Using existing images from REQUEST', [
                    'count' => count($imagePaths), 
                    'paths' => $imagePaths,
                    'raw_input' => $existingImagesInRequest,
                    'has_new_images' => $hasNewImages
                ]);
            }
        } else {
            // existing_images key was NOT sent in request at all
            // If new images are being uploaded, user wants to REPLACE all images
            // If no new images, keep current database images (user didn't modify images)
            if ($hasNewImages) {
                // User is uploading new images but didn't send existing_images key
                // This means: REPLACE all old images with new ones
                $imagePaths = [];
                \Log::info('REPLACING all images - new images uploaded but existing_images key not in request');
            } else {
                // No new images, no existing_images key - keep database images
                if ($destination->images) {
                    try {
                        $existingImgs = is_array($destination->images) 
                            ? $destination->images 
                            : json_decode($destination->images, true);
                        if (is_array($existingImgs)) {
                            $imagePaths = array_values(array_filter($existingImgs, function($path) {
                                return !empty($path) && is_string($path);
                            }));
                            \Log::info('Using existing images from DATABASE (no changes)', [
                                'count' => count($imagePaths), 
                                'paths' => $imagePaths
                            ]);
                        }
                    } catch (\Exception $e) {
                        \Log::warning('Failed to parse existing images from database', ['error' => $e->getMessage()]);
                    }
                }
            }
        }
        
        // SPECIAL CASE: If existing_images was sent as empty array AND new images are uploaded
        // This means user wants to REPLACE all old images with new ones
        if ($existingImagesExplicitlySent && is_array($existingImagesInRequest) && count($imagePaths) === 0 && $hasNewImages) {
            \Log::info('REPLACING all images - existing_images sent as empty array with new images');
            $imagePaths = []; // Already empty, but log it
        }

        // Add new uploaded images
        $newImageCount = 0;
        if ($hasNewImages) {
            $uploadedFiles = $request->file('images');
            \Log::info('Processing new images', ['count' => count($uploadedFiles), 'current_image_count' => count($imagePaths)]);
            foreach ($uploadedFiles as $file) {
                // Only add if we haven't reached the limit of 5
                if (count($imagePaths) < 5) {
                    $path = \App\Helpers\ImageProcessor::processAndStore($file, 'destination', 'uploads/destinations');
                    $imagePaths[] = $path;
                    $newImageCount++;
                }
            }
        }

        // Ensure we don't exceed 5 images total
        $imagePaths = array_slice($imagePaths, 0, 5);
        
        \Log::info('Final image paths', [
            'total' => count($imagePaths),
            'existing' => count($imagePaths) - $newImageCount,
            'new' => $newImageCount,
            'paths' => $imagePaths
        ]);

        $destination->update([
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'display_order' => $validated['display_order'] ?? 0,
            'country_id' => $validated['country_id'],
            'description' => $validated['description'],
            'images' => !empty($imagePaths) ? json_encode($imagePaths) : null,
        ]);

        // Sync services
        if (isset($validated['service_ids'])) {
            $destination->services()->sync($validated['service_ids']);
        }

        return response()->json($destination->load('services'));
    }

    /**
     * Delete a destination
     */
    public function destroy($id)
    {
        $destination = Destination::findOrFail($id);
        $destination->delete();

        return response()->json(['message' => 'Destination deleted successfully']);
    }

    /**
     * Get all services for selection (used in admin form)
     * Supports filtering by name, theme, service type, and country
     * Supports pagination with per_page parameter
     */
    public function getServices(Request $request)
    {
        try {
            \Log::info('DestinationController@getServices called', [
                'filters' => $request->all(),
                'page' => $request->get('page', 1),
                'per_page' => $request->get('per_page', 50)
            ]);

            $query = Service::with(['serviceTypes', 'themes', 'provider', 'country']);

            // Filter by name
            if ($request->has('name') && $request->name) {
                $query->where('name', 'like', '%' . $request->name . '%');
            }

            // Filter by theme
            if ($request->has('theme_id') && $request->theme_id) {
                $query->whereHas('themes', function($q) use ($request) {
                    $q->where('themes.id', $request->theme_id);
                });
            }

            // Filter by service type
            if ($request->has('service_type_id') && $request->service_type_id) {
                $query->whereHas('serviceTypes', function($q) use ($request) {
                    $q->where('service_types.id', $request->service_type_id);
                });
            }

            // Filter by country
            if ($request->has('country_id') && $request->country_id) {
                $query->where('country_id', $request->country_id);
            }

            // Get total count before pagination
            $total = $query->count();
            
            \Log::info('Total services found', ['total' => $total, 'filters' => $request->all()]);
            
            // Pagination
            $perPage = $request->get('per_page', 50); // Default 50 per page
            $page = $request->get('page', 1);
            
            $services = $query->orderBy('name')
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();
            
            \Log::info('Services fetched', ['count' => $services->count(), 'page' => $page]);
            
            return response()->json([
                'data' => $services,
                'total' => $total,
                'per_page' => $perPage,
                'current_page' => $page,
                'last_page' => ceil($total / $perPage),
                'has_more' => ($page * $perPage) < $total
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in getServices: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'data' => [],
                'total' => 0,
                'per_page' => 50,
                'current_page' => 1,
                'last_page' => 0,
                'has_more' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}