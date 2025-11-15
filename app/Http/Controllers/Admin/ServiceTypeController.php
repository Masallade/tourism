<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceType;
use Illuminate\Http\Request;

class ServiceTypeController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:service_types,name',
        ]);

        $serviceType = ServiceType::create($validated);
        return response()->json($serviceType, 201);
    }

    public function update(Request $request, ServiceType $serviceType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:service_types,name,' . $serviceType->id,
        ]);

        $serviceType->update($validated);
        return response()->json($serviceType);
    }
}



