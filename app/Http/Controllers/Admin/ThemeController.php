<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ThemeController extends Controller
{
    public function store(Request $request)
    {
        \Log::info('ThemeController store called', ['hasFile' => $request->hasFile('image'), 'file' => $request->file('image')]);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('uploads/themes', 'public');
            $validated['image_url'] = '/storage/' . $path;
            \Log::info('Theme image uploaded', ['path' => $path]);
        } else {
            \Log::info('No image uploaded for theme');
        }
        $theme = Theme::create($validated);
        \Log::info('Theme created', ['theme' => $theme]);
        return response()->json($theme);
    }

    public function update(Request $request, Theme $theme)
    {
        \Log::info('ThemeController update called', ['hasFile' => $request->hasFile('image'), 'file' => $request->file('image')]);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('uploads/themes', 'public');
            $validated['image_url'] = '/storage/' . $path;
            \Log::info('Theme image uploaded', ['path' => $path]);
        } else {
            \Log::info('No image uploaded for theme update');
        }
        $theme->update($validated);
        \Log::info('Theme updated', ['theme' => $theme]);
        return response()->json($theme);
    }
}
