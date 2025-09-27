<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Country;
use Illuminate\Support\Facades\DB;

class CountrySeeder extends Seeder
{
    public function run()
    {
        // Remove all country relations first (if any)
        // Example: If you have a country_service_provider or similar pivot, clear it here
        // DB::table('country_service_provider')->delete();

        // Remove all countries
        Country::query()->delete();

        // Add 10 new countries with images
        $countries = [
            ['name' => 'Thailand', 'slug' => 'thailand', 'description' => 'Land of smiles with beautiful beaches and rich culture.', 'image_url' => 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Italy', 'slug' => 'italy', 'description' => 'Home of art, history, and delicious food.', 'image_url' => 'https://images.unsplash.com/photo-1465101178521-c1a4c8a0a8b7?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Japan', 'slug' => 'japan', 'description' => 'Land of the rising sun and cherry blossoms.', 'image_url' => 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Brazil', 'slug' => 'brazil', 'description' => 'Vibrant culture and stunning natural wonders.', 'image_url' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Australia', 'slug' => 'australia', 'description' => 'Unique wildlife and beautiful beaches.', 'image_url' => 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'France', 'slug' => 'france', 'description' => 'Romantic cities and world-class cuisine.', 'image_url' => 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Kenya', 'slug' => 'kenya', 'description' => 'Safari adventures and breathtaking landscapes.', 'image_url' => 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Canada', 'slug' => 'canada', 'description' => 'Majestic mountains and multicultural cities.', 'image_url' => 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'India', 'slug' => 'india', 'description' => 'Colorful festivals and diverse traditions.', 'image_url' => 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'USA', 'slug' => 'usa', 'description' => 'From coast to coast, endless possibilities.', 'image_url' => 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'],
        ];
        foreach ($countries as $country) {
            Country::create($country);
        }
    }
}
