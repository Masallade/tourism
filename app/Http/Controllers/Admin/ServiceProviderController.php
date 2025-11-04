<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceProvider;
use App\Models\ServiceType;
use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\ServiceProviderStatusMail;

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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_range' => 'nullable|string',
            'website' => 'nullable|url',
            'email' => 'nullable|email',
        ]);
        $serviceProvider = ServiceProvider::create($validated);
        // Attach multiple service types
        if ($request->has('service_type_ids')) {
            $serviceProvider->serviceTypes()->sync($request->input('service_type_ids'));
        }
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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_range' => 'nullable|string',
            'website' => 'nullable|url',
            'email' => 'nullable|email',
        ]);
        $serviceProvider->update($validated);
        // Sync multiple service types
        if ($request->has('service_type_ids')) {
            $serviceProvider->serviceTypes()->sync($request->input('service_type_ids'));
        }
        return redirect()->route('admin.service-providers.index')->with('success', 'Service Provider updated successfully!');
    }

    public function destroy(ServiceProvider $serviceProvider)
    {
        $serviceProvider->delete();
        return redirect()->route('admin.service-providers.index')->with('success', 'Service Provider deleted successfully!');
    }

    // Approve a service provider (admin action)
    public function approve(ServiceProvider $serviceProvider)
    {
        // Generate random 8-character password (letters + numbers)
        $password = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 8);
        $serviceProvider->password = Hash::make($password);
        $serviceProvider->is_approved = true;
        $serviceProvider->save();
        // Send approval email with password
        // In production, queue to avoid blocking. In local, send synchronously for testing.
        if ($serviceProvider->email) {
            try {
                if (app()->environment('production')) {
                    Mail::to($serviceProvider->email)->queue(new ServiceProviderStatusMail('approved', $password));
                } else {
                    Mail::to($serviceProvider->email)->send(new ServiceProviderStatusMail('approved', $password));
                }
            } catch (\Exception $e) {
                \Log::warning('Failed to send approval email: ' . $e->getMessage());
            }
        }
        return response()->json(['message' => 'Service provider approved and email sent.']);
    }

    // Reject a service provider (admin action)
    public function reject(ServiceProvider $serviceProvider)
    {
        $serviceProvider->is_approved = false;
        $serviceProvider->save();
        // Send rejection email
        // In production, queue to avoid blocking. In local, send synchronously for testing.
        if ($serviceProvider->email) {
            try {
                if (app()->environment('production')) {
                    Mail::to($serviceProvider->email)->queue(new ServiceProviderStatusMail('rejected'));
                } else {
                    Mail::to($serviceProvider->email)->send(new ServiceProviderStatusMail('rejected'));
                }
            } catch (\Exception $e) {
                \Log::warning('Failed to send rejection email: ' . $e->getMessage());
            }
        }
        return response()->json(['message' => 'Service provider rejected and email sent.']);
    }
}