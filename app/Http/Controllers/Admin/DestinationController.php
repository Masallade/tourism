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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'display_order' => 'nullable|integer|min:0',
            'service_ids' => 'nullable|array',
            'service_ids.*' => 'exists:services,id',
        ]);

        $destination = Destination::create([
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'display_order' => $validated['display_order'] ?? 0,
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

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'display_order' => 'nullable|integer|min:0',
            'service_ids' => 'nullable|array',
            'service_ids.*' => 'exists:services,id',
        ]);

        $destination->update([
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'display_order' => $validated['display_order'] ?? 0,
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

