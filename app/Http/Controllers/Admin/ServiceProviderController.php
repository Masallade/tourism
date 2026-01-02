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
    // Redirect to React admin dashboard - all UI is handled in React
    public function index()
    {
        return redirect('/admin/service-providers');
    }

    public function create()
    {
        return redirect('/admin/service-providers');
    }

    // Note: store, update, destroy are handled via API routes in routes/api.php
    // These methods are kept for backward compatibility but should not be used
    // The API endpoints in routes/api.php handle all CRUD operations
    public function store(Request $request)
    {
        // This should be handled via API endpoint, redirect to React
        return redirect('/admin/service-providers');
    }

    public function edit(ServiceProvider $serviceProvider)
    {
        return redirect('/admin/service-providers');
    }

    public function update(Request $request, ServiceProvider $serviceProvider)
    {
        // This should be handled via API endpoint, redirect to React
        return redirect('/admin/service-providers');
    }

    public function destroy(ServiceProvider $serviceProvider)
    {
        // This should be handled via API endpoint, redirect to React
        return redirect('/admin/service-providers');
    }

    // Approve a service provider (admin action)
    public function approve(ServiceProvider $serviceProvider)
    {
        // Generate random 8-character password (letters + numbers)
        // $password = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 8);
        // Fixed password for all service providers
        $password = '12345678';
        $serviceProvider->password = Hash::make($password);
        $serviceProvider->is_approved = true;
        $serviceProvider->save();
        // Send approval email with password
        // In production, queue to avoid blocking. In local, send synchronously for testing.
        if ($serviceProvider->email) {
            \Log::info('ServiceProviderController: Attempting to send approval email', [
                'email' => $serviceProvider->email,
                'environment' => app()->environment(),
                'mail_mailer' => config('mail.default'),
            ]);
            
            try {
                if (app()->environment('production')) {
                    \Log::info('ServiceProviderController: Queueing approval email (production)');
                    Mail::to($serviceProvider->email)->queue(new ServiceProviderStatusMail('approved', $password));
                    \Log::info('ServiceProviderController: Approval email queued successfully');
                } else {
                    \Log::info('ServiceProviderController: Sending approval email synchronously (local)');
                    Mail::to($serviceProvider->email)->send(new ServiceProviderStatusMail('approved', $password));
                    \Log::info('ServiceProviderController: Approval email sent successfully');
                }
            } catch (\Exception $e) {
                \Log::error('ServiceProviderController: Failed to send approval email', [
                    'error' => $e->getMessage(),
                    'email' => $serviceProvider->email,
                    'trace' => $e->getTraceAsString()
                ]);
            }
        } else {
            \Log::warning('ServiceProviderController: No email address for service provider', [
                'service_provider_id' => $serviceProvider->id,
            ]);
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
            \Log::info('ServiceProviderController: Attempting to send rejection email', [
                'email' => $serviceProvider->email,
                'environment' => app()->environment(),
                'mail_mailer' => config('mail.default'),
            ]);
            
            try {
                if (app()->environment('production')) {
                    \Log::info('ServiceProviderController: Queueing rejection email (production)');
                    Mail::to($serviceProvider->email)->queue(new ServiceProviderStatusMail('rejected'));
                    \Log::info('ServiceProviderController: Rejection email queued successfully');
                } else {
                    \Log::info('ServiceProviderController: Sending rejection email synchronously (local)');
                    Mail::to($serviceProvider->email)->send(new ServiceProviderStatusMail('rejected'));
                    \Log::info('ServiceProviderController: Rejection email sent successfully');
                }
            } catch (\Exception $e) {
                \Log::error('ServiceProviderController: Failed to send rejection email', [
                    'error' => $e->getMessage(),
                    'email' => $serviceProvider->email,
                    'trace' => $e->getTraceAsString()
                ]);
            }
        } else {
            \Log::warning('ServiceProviderController: No email address for service provider', [
                'service_provider_id' => $serviceProvider->id,
            ]);
        }
        return response()->json(['message' => 'Service provider rejected and email sent.']);
    }
}