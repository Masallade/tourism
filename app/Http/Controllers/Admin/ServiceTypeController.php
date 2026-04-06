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
            'name_en' => 'nullable|string|max:255',
            'name_fr' => 'nullable|string|max:255',
            'name_es' => 'nullable|string|max:255',
        ]);

        // If name_en is not provided, use name as name_en
        if (empty($validated['name_en'])) {
            $validated['name_en'] = $validated['name'];
        }

        $serviceType = ServiceType::create($validated);
        return response()->json($serviceType, 201);
    }

    public function update(Request $request, ServiceType $serviceType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:service_types,name,' . $serviceType->id,
            'name_en' => 'nullable|string|max:255',
            'name_fr' => 'nullable|string|max:255',
            'name_es' => 'nullable|string|max:255',
        ]);

        // If name_en is not provided, use name as name_en
        if (empty($validated['name_en'])) {
            $validated['name_en'] = $validated['name'];
        }

        $serviceType->update($validated);
        return response()->json($serviceType);
    }
}



