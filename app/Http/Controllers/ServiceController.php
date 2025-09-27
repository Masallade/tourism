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
        $provider = $request->user();
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'service_type_id' => 'required|exists:service_types,id',
        ]);
        // Only allow service_type_id that belongs to provider's allowed types
        $allowedTypeIds = $provider->service_types->pluck('id')->toArray();
        if (!in_array($validated['service_type_id'], $allowedTypeIds)) {
            return response()->json(['error' => 'Invalid service type.'], 403);
        }
        $service = Service::create([
            'provider_id' => $provider->id,
            'country_id' => $provider->country_id,
            'service_type_id' => $validated['service_type_id'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'] ?? null,
        ]);
        return response()->json($service, 201);
    }
}
