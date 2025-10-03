<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\ServiceProvider;

class ServiceProviderPasswordController extends Controller
{
    public function change(Request $request)
    {
        $request->validate([
            'provider_id' => 'required|exists:service_providers,id',
            'old_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $provider = ServiceProvider::findOrFail($request->provider_id);

        if (!Hash::check($request->old_password, $provider->password)) {
            return response()->json(['error' => 'Old password is incorrect.'], 422);
        }

        $provider->password = Hash::make($request->new_password);
        $provider->save();

        return response()->json(['message' => 'Password changed successfully.']);
    }
}
