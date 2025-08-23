<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceProvider;
use App\Models\ServiceType;
use App\Models\Country;
use Illuminate\Http\Request;

class ServiceProviderController extends Controller
{
    public function index()
    {
        $serviceProviders = ServiceProvider::with(['country', 'serviceType', 'themes'])->get();
        return view('admin.service-providers.index', compact('serviceProviders'));
    }

    public function create()
    {
        $countries = Country::all();
        $serviceTypes = ServiceType::all();
        return view('admin.service-providers.create', compact('countries', 'serviceTypes'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'country_id' => 'required|exists:countries,id',
            'service_type_id' => 'required|exists:service_types,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_range' => 'nullable|string',
            'website' => 'nullable|url',
            'email' => 'nullable|email',
        ]);
        $serviceProvider = ServiceProvider::create($validated);
        return redirect()->route('admin.service-providers.index')->with('success', 'Service Provider added successfully!');
    }

    public function edit(ServiceProvider $serviceProvider)
    {
        $countries = Country::all();
        $serviceTypes = ServiceType::all();
        return view('admin.service-providers.edit', compact('serviceProvider', 'countries', 'serviceTypes'));
    }

    public function update(Request $request, ServiceProvider $serviceProvider)
    {
        $validated = $request->validate([
            'country_id' => 'required|exists:countries,id',
            'service_type_id' => 'required|exists:service_types,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_range' => 'nullable|string',
            'website' => 'nullable|url',
            'email' => 'nullable|email',
        ]);
        $serviceProvider->update($validated);
        return redirect()->route('admin.service-providers.index')->with('success', 'Service Provider updated successfully!');
    }

    public function destroy(ServiceProvider $serviceProvider)
    {
        $serviceProvider->delete();
        return redirect()->route('admin.service-providers.index')->with('success', 'Service Provider deleted successfully!');
    }
}
