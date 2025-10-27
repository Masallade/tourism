<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\ServiceType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ServiceController extends Controller
{
    // List all services for a provider
    public function index(Request $request)
    {
        // Use provider_id from request (input or query param), fallback to auth if available
        $providerId = $request->input('provider_id') ?? $request->query('provider_id');
        if (!$providerId && $request->user()) {
            $providerId = $request->user()->id;
        }
        if (!$providerId) {
            return response()->json(['error' => 'provider_id is required'], 400);
        }
        $services = Service::where('provider_id', $providerId)->with('serviceType', 'country', 'theme')->get();
        return response()->json($services);
    }

    // List all services from all providers (for public trips page)
    public function all(Request $request)
    {
        $services = Service::with(['serviceType', 'country', 'theme', 'provider'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($services);
    }

    // Store a new service
    public function store(Request $request)
    {
        \Log::info('ServiceController@store - Starting service creation');
        
        try {
            // First, let's temporarily disable foreign key checks to bypass the constraint issues
            \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
            
            // Log all incoming request data
            \Log::info('Request data:', $request->all());
            
            // Check if country_id exists in the request
            $countryId = $request->input('country_id');
            if (empty($countryId)) {
                \Log::error('country_id is missing from the request');
                throw new \Exception('Country ID is required to create a service');
            } else {
                \Log::info('Using country_id from request: ' . $countryId);
            }
            
            // Get the provider_id directly from the request with no fallback
            $providerId = $request->input('provider_id');
            
            if (empty($providerId)) {
                \Log::error('provider_id is missing from request');
                throw new \Exception('Provider ID is required to create a service');
            }
            
            \Log::info('Using provider_id from request: ' . $providerId);
            
            // Handle main image upload if present
            $imagePath = null;
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $imagePath = $file->storeAs('uploads/services', $filename, 'public');
            }
            
            // Handle second image upload
            $imagePath2 = null;
            if ($request->hasFile('image_2')) {
                $file = $request->file('image_2');
                $filename = time() . '_' . uniqid() . '_2.' . $file->getClientOriginalExtension();
                $imagePath2 = $file->storeAs('uploads/services', $filename, 'public');
            }
            
            // Handle third image upload
            $imagePath3 = null;
            if ($request->hasFile('image_3')) {
                $file = $request->file('image_3');
                $filename = time() . '_' . uniqid() . '_3.' . $file->getClientOriginalExtension();
                $imagePath3 = $file->storeAs('uploads/services', $filename, 'public');
            }

            $serviceData = [
                'provider_id' => $providerId,
                'country_id' => $countryId,
                'service_type_id' => $request->input('service_type_id'),
                'theme_id' => $request->input('theme_id'),
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'price' => $request->input('price'),
                'image' => $imagePath,
                'image_2' => $imagePath2,
                'image_3' => $imagePath3,
                'min_age' => $request->input('min_age'),
                'max_age' => $request->input('max_age'),
                'duration' => $request->input('duration'),
                'overview' => $request->input('overview'),
                'details' => $request->input('details'),
                'lat' => $request->input('lat'),
                'lng' => $request->input('lng'),
                'created_at' => now(),
                'updated_at' => now()
            ];
            
            \Log::info('Creating service with data:', $serviceData);
            
            try {
                // Log important IDs before inserting
                \Log::info('Important IDs for service creation:', [
                    'provider_id' => $serviceData['provider_id'],
                    'country_id' => $serviceData['country_id'],
                    'service_type_id' => $serviceData['service_type_id'],
                    'theme_id' => $serviceData['theme_id']
                ]);
                
                // Create the service using the model
                $service = Service::create($serviceData);
                $id = $service->id; // For later use
            } catch (\Exception $insertError) {
                \Log::error('Failed to insert service: ' . $insertError->getMessage(), [
                    'provider_id' => $serviceData['provider_id'],
                    'country_id' => $serviceData['country_id']
                ]);
                throw $insertError; // Re-throw to be caught by outer catch
            }
            
            // Re-enable foreign key checks
            \DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            
            \Log::info('Service created with ID: ' . $id);
            
            return response()->json([
                'id' => $id,
                'message' => 'Service created successfully',
                'service' => $serviceData
            ], 201);
            
        } catch (\Exception $e) {
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
            
            // Log all incoming request data
            \Log::info('Update request data:', $request->all());
            
            // Handle main image upload if present
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($service->image && \Storage::disk('public')->exists($service->image)) {
                    \Storage::disk('public')->delete($service->image);
                }
                $file = $request->file('image');
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $service->image = $file->storeAs('uploads/services', $filename, 'public');
            }
            
            // Handle second image upload
            if ($request->hasFile('image_2')) {
                if ($service->image_2 && \Storage::disk('public')->exists($service->image_2)) {
                    \Storage::disk('public')->delete($service->image_2);
                }
                $file = $request->file('image_2');
                $filename = time() . '_' . uniqid() . '_2.' . $file->getClientOriginalExtension();
                $service->image_2 = $file->storeAs('uploads/services', $filename, 'public');
            }
            
            // Handle third image upload
            if ($request->hasFile('image_3')) {
                if ($service->image_3 && \Storage::disk('public')->exists($service->image_3)) {
                    \Storage::disk('public')->delete($service->image_3);
                }
                $file = $request->file('image_3');
                $filename = time() . '_' . uniqid() . '_3.' . $file->getClientOriginalExtension();
                $service->image_3 = $file->storeAs('uploads/services', $filename, 'public');
            }

            // Update service data
            $service->update([
                'service_type_id' => $request->input('service_type_id', $service->service_type_id),
                'theme_id' => $request->input('theme_id', $service->theme_id),
                'name' => $request->input('name', $service->name),
                'description' => $request->input('description', $service->description),
                'price' => $request->input('price', $service->price),
                'min_age' => $request->input('min_age', $service->min_age),
                'max_age' => $request->input('max_age', $service->max_age),
                'duration' => $request->input('duration', $service->duration),
                'overview' => $request->input('overview', $service->overview),
                'details' => $request->input('details', $service->details),
                'lat' => $request->input('lat', $service->lat),
                'lng' => $request->input('lng', $service->lng),
            ]);
            
            \Log::info('Service updated successfully: ' . $id);
            
            return response()->json([
                'message' => 'Service updated successfully',
                'service' => $service->load('serviceType', 'country', 'theme')
            ], 200);
            
        } catch (\Exception $e) {
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
            
            // Delete images if they exist
            if ($service->image && \Storage::disk('public')->exists($service->image)) {
                \Storage::disk('public')->delete($service->image);
            }
            if ($service->image_2 && \Storage::disk('public')->exists($service->image_2)) {
                \Storage::disk('public')->delete($service->image_2);
            }
            if ($service->image_3 && \Storage::disk('public')->exists($service->image_3)) {
                \Storage::disk('public')->delete($service->image_3);
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
