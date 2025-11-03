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
        
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'slug' => 'required|string|max:255|unique:countries,slug',
                'description' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
                'image_url' => 'nullable|url',
            ]);
            
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $path = $file->store('uploads/countries', 'public');
                
                // Verify the file was actually saved
                if (!Storage::disk('public')->exists($path)) {
                    \Log::error('Image file was not saved', ['path' => $path]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to save image file. Please try again.',
                        'errors' => ['image' => ['The image file could not be saved. Please check storage permissions.']]
                    ], 422);
                }
                
                $validated['image_url'] = '/storage/' . $path;
                \Log::info('Country image uploaded successfully', ['path' => $path, 'full_path' => storage_path('app/public/' . $path)]);
            } else if ($request->filled('image_url')) {
                $validated['image_url'] = $request->input('image_url');
                \Log::info('Country image set via URL');
            } else {
                \Log::info('No image uploaded for country');
            }
            
            $country = Country::create($validated);
            \Log::info('Country created successfully', ['country' => $country]);
            
            return response()->json([
                'success' => true,
                'country' => $country,
                'message' => 'Country created successfully' . ($request->hasFile('image') ? ' with image' : '')
            ]);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation error in CountryController store', ['errors' => $e->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error in CountryController store', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while saving the country: ' . $e->getMessage(),
                'errors' => ['general' => ['Failed to save country. Please try again.']]
            ], 500);
        }
    }

    public function update(Request $request, Country $country)
    {
        \Log::info('CountryController update called', ['hasFile' => $request->hasFile('image'), 'file' => $request->file('image')]);
        
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'slug' => 'required|string|max:255|unique:countries,slug,' . $country->id,
                'description' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
                'image_url' => 'nullable|url',
            ]);
            
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($country->image_url) {
                    $oldPath = str_replace('/storage/', '', $country->image_url);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                        \Log::info('Old country image deleted', ['path' => $oldPath]);
                    }
                }
                
                $file = $request->file('image');
                $path = $file->store('uploads/countries', 'public');
                
                // Verify the file was actually saved
                if (!Storage::disk('public')->exists($path)) {
                    \Log::error('Image file was not saved during update', ['path' => $path]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to save image file. Please try again.',
                        'errors' => ['image' => ['The image file could not be saved. Please check storage permissions.']]
                    ], 422);
                }
                
                $validated['image_url'] = '/storage/' . $path;
                \Log::info('Country image uploaded successfully', ['path' => $path, 'full_path' => storage_path('app/public/' . $path)]);
            } else if ($request->filled('image_url')) {
                $validated['image_url'] = $request->input('image_url');
                \Log::info('Country image set via URL on update');
            } else {
                \Log::info('No image uploaded for country update');
            }
            
            $country->update($validated);
            \Log::info('Country updated successfully', ['country' => $country]);
            
            return response()->json([
                'success' => true,
                'country' => $country,
                'message' => 'Country updated successfully' . ($request->hasFile('image') ? ' with new image' : '')
            ]);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation error in CountryController update', ['errors' => $e->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error in CountryController update', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the country: ' . $e->getMessage(),
                'errors' => ['general' => ['Failed to update country. Please try again.']]
            ], 500);
        }
    }
}
