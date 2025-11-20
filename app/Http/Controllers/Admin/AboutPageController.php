<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AboutPage;
use Illuminate\Http\Request;

class AboutPageController extends Controller
{
    /**
     * Get about page content (single record or create default)
     */
    public function index()
    {
        $aboutPage = AboutPage::first();
        
        // If no about page exists, return default empty structure
        if (!$aboutPage) {
            return response()->json([
                'id' => null,
                'hero_title' => null,
                'hero_subtitle' => null,
                'hero_image' => null,
                'mission_title' => null,
                'mission_description' => null,
                'mission_image' => null,
                'mission_stat_number' => null,
                'mission_stat_label' => null,
                'values_title' => null,
                'values' => null,
                'impact_title' => null,
                'impact_stat_1_number' => null,
                'impact_stat_1_label' => null,
                'impact_stat_2_number' => null,
                'impact_stat_2_label' => null,
                'impact_stat_3_number' => null,
                'impact_stat_3_label' => null,
                'impact_stat_4_number' => null,
                'impact_stat_4_label' => null,
                'team_title' => null,
                'team_description' => null,
                'team_members' => null,
                'cta_title' => null,
                'cta_description' => null,
            ]);
        }
        
        return response()->json($aboutPage);
    }

    /**
     * Create or update about page content
     */
    public function store(Request $request)
    {
        // Parse JSON strings from FormData
        $values = $request->input('values');
        if (is_string($values)) {
            $values = json_decode($values, true);
            $request->merge(['values' => $values]);
        }

        $teamMembers = $request->input('team_members');
        if (is_string($teamMembers)) {
            $teamMembers = json_decode($teamMembers, true);
            $request->merge(['team_members' => $teamMembers]);
        }

        $validated = $request->validate([
            'hero_title' => 'nullable|string|max:255',
            'hero_subtitle' => 'nullable|string|max:500',
            'hero_image' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'mission_title' => 'nullable|string|max:255',
            'mission_description' => 'nullable|string',
            'mission_image' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'mission_stat_number' => 'nullable|string|max:50',
            'mission_stat_label' => 'nullable|string|max:100',
            'values_title' => 'nullable|string|max:255',
            'values' => 'nullable|array',
            'values.*.title' => 'nullable|string|max:255',
            'values.*.description' => 'nullable|string',
            'impact_title' => 'nullable|string|max:255',
            'impact_stat_1_number' => 'nullable|string|max:50',
            'impact_stat_1_label' => 'nullable|string|max:100',
            'impact_stat_2_number' => 'nullable|string|max:50',
            'impact_stat_2_label' => 'nullable|string|max:100',
            'impact_stat_3_number' => 'nullable|string|max:50',
            'impact_stat_3_label' => 'nullable|string|max:100',
            'impact_stat_4_number' => 'nullable|string|max:50',
            'impact_stat_4_label' => 'nullable|string|max:100',
            'team_title' => 'nullable|string|max:255',
            'team_description' => 'nullable|string',
            'team_members' => 'nullable|array',
            'team_members.*.name' => 'nullable|string|max:255',
            'team_members.*.role' => 'nullable|string|max:255',
            'team_members.*.image' => 'nullable|string|max:500', // Can be URL or file path
            'team_member_images' => 'nullable|array',
            'team_member_images.*' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'cta_title' => 'nullable|string|max:255',
            'cta_description' => 'nullable|string',
        ]);

        $aboutPage = AboutPage::first();
        
        $data = $request->except(['hero_image', 'mission_image', 'team_member_images']);

        // Handle hero image upload
        if ($request->hasFile('hero_image')) {
            // Delete old image if exists
            if ($aboutPage && $aboutPage->hero_image) {
                $oldPath = storage_path('app/public/' . $aboutPage->hero_image);
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }
            $imagePath = $request->file('hero_image')->store('uploads/about_page', 'public');
            $data['hero_image'] = $imagePath;
        } else {
            // Preserve existing image if no new file is uploaded
            if ($aboutPage && $aboutPage->hero_image) {
                $data['hero_image'] = $aboutPage->hero_image;
            }
        }

        // Handle mission image upload
        if ($request->hasFile('mission_image')) {
            // Delete old image if exists
            if ($aboutPage && $aboutPage->mission_image) {
                $oldPath = storage_path('app/public/' . $aboutPage->mission_image);
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }
            $imagePath = $request->file('mission_image')->store('uploads/about_page', 'public');
            $data['mission_image'] = $imagePath;
        } else {
            // Preserve existing image if no new file is uploaded
            if ($aboutPage && $aboutPage->mission_image) {
                $data['mission_image'] = $aboutPage->mission_image;
            }
        }

        // Handle team member image uploads
        if ($request->has('team_members')) {
            // team_members is already parsed above, so use the request value
            $teamMembers = $request->team_members;
            
            // Process uploaded images for team members
            if ($request->hasFile('team_member_images')) {
                $uploadedImages = $request->file('team_member_images');
                
                // Process each uploaded image with its index
                foreach ($uploadedImages as $index => $image) {
                    if ($image && isset($teamMembers[$index])) {
                        $imagePath = $image->store('uploads/about_page/team', 'public');
                        $teamMembers[$index]['image'] = $imagePath;
                    }
                }
            }
            
            $data['team_members'] = $teamMembers;
        }
        
        if ($aboutPage) {
            $aboutPage->update($data);
        } else {
            $aboutPage = AboutPage::create($data);
        }

        return response()->json($aboutPage);
    }
}

