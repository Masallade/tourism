<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    // List all services for a provider
    public function index(Request $request)
    {
        $providerId = $request->input('provider_id') ?? $request->query('provider_id');

        if (!$providerId) {
            return response()->json(['error' => 'provider_id is required'], 400);
        }

        $services = Service::where('provider_id', $providerId)
            ->with(['serviceTypes', 'themes', 'country'])
            ->get();

        return response()->json($services);
    }

    // List all services from all providers (for public trips page)
    public function all(Request $request)
    {
        $services = Service::with(['serviceTypes', 'themes', 'country', 'provider'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($services);
    }

    // Store a new service
    public function store(Request $request)
    {
        \Log::info('ServiceController@store - Starting service creation');

        $validated = $request->validate([
            'provider_id' => 'required|exists:service_providers,id',
            'country_id' => 'required|exists:countries,id',
            'service_type_ids' => 'required|array|min:1',
            'service_type_ids.*' => 'exists:service_types,id',
            'theme_ids' => 'required|array|min:1',
            'theme_ids.*' => 'exists:themes,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'overview' => 'nullable|string',
            'details' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'min_age' => 'nullable|integer|min:0',
            'max_age' => 'nullable|integer|min:0',
            'min_travelers' => 'required|integer|min:1|max:100',
            'max_travelers' => 'required|integer|min:1|max:100|gte:min_travelers',
            'duration' => 'nullable|string|max:255',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:10240',
            'image_2' => 'nullable|image|mimes:jpeg,png,jpg|max:10240',
            'image_3' => 'nullable|image|mimes:jpeg,png,jpg|max:10240',
        ]);

        DB::beginTransaction();

        try {
            $serviceData = collect($validated)
                ->except(['service_type_ids', 'theme_ids', 'image', 'image_2', 'image_3'])
                ->toArray();

            foreach (['image', 'image_2', 'image_3'] as $field) {
                $serviceData[$field] = null;
                if ($request->hasFile($field)) {
                    $file = $request->file($field);
                    $filename = time() . '_' . uniqid() . '_' . $field . '.' . $file->getClientOriginalExtension();
                    $serviceData[$field] = $file->storeAs('uploads/services', $filename, 'public');
                }
            }

                $service = Service::create($serviceData);
            $service->serviceTypes()->sync($validated['service_type_ids']);
            $service->themes()->sync($validated['theme_ids']);

            DB::commit();
            
            return response()->json([
                'id' => $service->id,
                'message' => 'Service created successfully',
                'service' => $service->load(['serviceTypes', 'themes', 'country']),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to create service: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Failed to create service: ' . $e->getMessage()
            ], 500);
        }
    }

    // Update an existing service
    public function update(Request $request, $id)
    {
        \Log::info('ServiceController@update - Starting service update for ID: ' . $id);
        
        try {
            $service = Service::findOrFail($id);
            
            $validated = $request->validate([
                'service_type_ids' => 'required|array|min:1',
                'service_type_ids.*' => 'exists:service_types,id',
                'theme_ids' => 'required|array|min:1',
                'theme_ids.*' => 'exists:themes,id',
                'name' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'overview' => 'nullable|string',
                'details' => 'nullable|string',
                'price' => 'nullable|numeric|min:0',
                'min_age' => 'nullable|integer|min:0',
                'max_age' => 'nullable|integer|min:0',
                'min_travelers' => 'required|integer|min:1|max:100',
                'max_travelers' => 'required|integer|min:1|max:100|gte:min_travelers',
                'duration' => 'nullable|string|max:255',
                'lat' => 'nullable|numeric',
                'lng' => 'nullable|numeric',
                'image' => 'nullable|image|mimes:jpeg,png,jpg|max:10240',
                'image_2' => 'nullable|image|mimes:jpeg,png,jpg|max:10240',
                'image_3' => 'nullable|image|mimes:jpeg,png,jpg|max:10240',
            ]);

            DB::beginTransaction();

            $updateData = collect($validated)
                ->except(['service_type_ids', 'theme_ids', 'image', 'image_2', 'image_3'])
                ->toArray();

            foreach (['image', 'image_2', 'image_3'] as $field) {
                if ($request->hasFile($field)) {
                    if ($service->{$field} && Storage::disk('public')->exists($service->{$field})) {
                        Storage::disk('public')->delete($service->{$field});
                    }
                    $file = $request->file($field);
                    $filename = time() . '_' . uniqid() . '_' . $field . '.' . $file->getClientOriginalExtension();
                    $updateData[$field] = $file->storeAs('uploads/services', $filename, 'public');
                }
            }

            $service->update($updateData);
            $service->serviceTypes()->sync($validated['service_type_ids']);
            $service->themes()->sync($validated['theme_ids']);

            DB::commit();
            
            \Log::info('Service updated successfully: ' . $id);
            
            return response()->json([
                'message' => 'Service updated successfully',
                'service' => $service->load('serviceTypes', 'country', 'themes')
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to update service: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to update service: ' . $e->getMessage()
            ], 500);
        }
    }

    // Delete a service
    public function destroy($id)
    {
        try {
            $service = Service::findOrFail($id);
            
            foreach (['image', 'image_2', 'image_3'] as $field) {
                if ($service->{$field} && Storage::disk('public')->exists($service->{$field})) {
                    Storage::disk('public')->delete($service->{$field});
                }
            }
            
            $service->delete();
            
            return response()->json([
                'message' => 'Service deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Failed to delete service: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to delete service: ' . $e->getMessage()
            ], 500);
        }
    }
}
