<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Theme;
use Illuminate\Support\Facades\DB;

class ThemeSeeder extends Seeder
{
    public function run()
    {
    // Remove all theme relations first
    \DB::table('provider_theme')->delete();
    // Remove all themes
    Theme::query()->delete();

        // Add 10 new themes with images
        $themes = [
            ['name' => 'Adventure', 'image_url' => 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Beach', 'image_url' => 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Cultural', 'image_url' => 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Wildlife', 'image_url' => 'https://images.unsplash.com/photo-1465101178521-c1a4c8a0a8b7?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Mountain', 'image_url' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Wellness', 'image_url' => 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Food & Culinary', 'image_url' => 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Photography', 'image_url' => 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Volunteering', 'image_url' => 'https://images.unsplash.com/photo-1465101178521-c1a4c8a0a8b7?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Historical', 'image_url' => 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'],
        ];
        foreach ($themes as $theme) {
            Theme::create($theme);
        }
    }
}
