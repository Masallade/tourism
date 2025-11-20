<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ThemeController extends Controller
{
    public function store(Request $request)
    {
        \Log::info('ThemeController store called', ['hasFile' => $request->hasFile('image'), 'file' => $request->file('image')]);
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
                'image_url' => ['nullable', 'string', 'max:2048', $this->imageUrlRule()],
            ]);
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('uploads/themes', 'public');
                $validated['image_url'] = '/storage/' . $path;
                \Log::info('Theme image uploaded', ['path' => $path]);
            } else if ($request->filled('image_url')) {
                $validated['image_url'] = $request->input('image_url');
                \Log::info('Theme image set via URL');
            } else {
                \Log::info('No image uploaded for theme');
            }
            $theme = Theme::create($validated);
            \Log::info('Theme created', ['theme' => $theme]);
            return response()->json($theme);
        } catch (ValidationException $e) {
            \Log::error('Theme validation failed on store', ['errors' => $e->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    public function update(Request $request, Theme $theme)
    {
        \Log::info('ThemeController update called', ['hasFile' => $request->hasFile('image'), 'file' => $request->file('image')]);
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
                'image_url' => ['nullable', 'string', 'max:2048', $this->imageUrlRule()],
            ]);
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('uploads/themes', 'public');
                $validated['image_url'] = '/storage/' . $path;
                \Log::info('Theme image uploaded', ['path' => $path]);
            } else if ($request->filled('image_url')) {
                $validated['image_url'] = $request->input('image_url');
                \Log::info('Theme image set via URL on update');
            } else {
                \Log::info('No image uploaded for theme update');
            }
            $theme->update($validated);
            \Log::info('Theme updated', ['theme' => $theme]);
            return response()->json($theme);
        } catch (ValidationException $e) {
            \Log::error('Theme validation failed on update', ['errors' => $e->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Theme update failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Unable to update theme',
                'errors' => ['general' => [$e->getMessage()]],
            ], 500);
        }
    }

    private function imageUrlRule(): \Closure
    {
        return function (string $attribute, mixed $value, \Closure $fail): void {
            if (empty($value)) {
                return;
            }

            $isValidFullUrl = filter_var($value, FILTER_VALIDATE_URL);
            $isStoragePath = str_starts_with($value, '/storage/');

            if (!$isValidFullUrl && !$isStoragePath) {
                $fail('The ' . str_replace('_', ' ', $attribute) . ' must be a valid URL or storage path.');
            }
        };
    }
}
