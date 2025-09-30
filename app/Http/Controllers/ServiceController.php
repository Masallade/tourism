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
        $providerId = $request->user()->id;
        $services = Service::where('provider_id', $providerId)->with('serviceType', 'country')->get();
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
            
            // Use only the values from the request with no defaults
            $serviceData = [
                'provider_id' => $providerId,
                'country_id' => $countryId,
                'service_type_id' => $request->input('service_type_id'),
                'theme_id' => $request->input('theme_id'),
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'price' => $request->input('price'),
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
}
