<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CountryController extends Controller
{
    public function store(Request $request)
    {
        \Log::info('CountryController store called', ['hasFile' => $request->hasFile('image'), 'file' => $request->file('image')]);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:countries,slug',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('uploads/countries', 'public');
            $validated['image_url'] = '/storage/' . $path;
            \Log::info('Country image uploaded', ['path' => $path]);
        } else {
            \Log::info('No image uploaded for country');
        }
        $country = Country::create($validated);
        \Log::info('Country created', ['country' => $country]);
        return response()->json($country);
    }

    public function update(Request $request, Country $country)
    {
        \Log::info('CountryController update called', ['hasFile' => $request->hasFile('image'), 'file' => $request->file('image')]);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:countries,slug,' . $country->id,
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('uploads/countries', 'public');
            $validated['image_url'] = '/storage/' . $path;
            \Log::info('Country image uploaded', ['path' => $path]);
        } else {
            \Log::info('No image uploaded for country update');
        }
        $country->update($validated);
        \Log::info('Country updated', ['country' => $country]);
        return response()->json($country);
    }
}
