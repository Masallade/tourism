<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Country;
use App\Models\ServiceProvider;
use App\Models\Theme;

class TourismSeeder extends Seeder
{
    public function run(): void
    {
        // Create Countries
        $countries = [
            [
                'name' => 'Thailand',
                'slug' => 'thailand',
                'description' => 'Land of smiles with beautiful beaches and rich culture',
                'lat' => 13.7563,
                'lng' => 100.5018,
            ],
            [
                'name' => 'Bali, Indonesia',
                'slug' => 'bali-indonesia',
                'description' => 'Island of the Gods with stunning temples and beaches',
                'lat' => -8.3405,
                'lng' => 115.0920,
            ],
            [
                'name' => 'Costa Rica',
                'slug' => 'costa-rica',
                'description' => 'Pura Vida! Rich biodiversity and eco-tourism',
                'lat' => 9.9281,
                'lng' => -84.0907,
            ],
            [
                'name' => 'New Zealand',
                'slug' => 'new-zealand',
                'description' => 'Adventure capital with stunning landscapes',
                'lat' => -40.9006,
                'lng' => 174.8860,
            ],
            [
                'name' => 'Norway',
                'slug' => 'norway',
                'description' => 'Land of fjords and northern lights',
                'lat' => 60.4720,
                'lng' => 8.4689,
            ],
        ];

        foreach ($countries as $countryData) {
            Country::create($countryData);
        }

        // Create Themes
        $themes = [
            'Adventure',
            'Eco-Tourism',
            'Cultural Heritage',
            'Beach & Water Sports',
            'Mountain & Hiking',
            'Wildlife & Nature',
            'Wellness & Spa',
            'Food & Culinary',
            'Photography',
            'Volunteering',
        ];

        foreach ($themes as $themeName) {
            Theme::create(['name' => $themeName]);
        }

        // Create Service Providers
        $serviceProviders = [
            [
                'country_id' => 1, // Thailand
                'name' => 'Bangkok Eco Resort',
                'type' => 'accommodation',
                'description' => 'Sustainable luxury resort in the heart of Bangkok',
                'price_range' => '$$$',
                'website' => 'https://bangkokecoresort.com',
                'email' => 'info@bangkokecoresort.com',
                'phone' => '+66-2-123-4567',
                'lat' => 13.7563,
                'lng' => 100.5018,
                'is_approved' => true,
            ],
            [
                'country_id' => 1, // Thailand
                'name' => 'Thai Adventure Tours',
                'type' => 'tour_operator',
                'description' => 'Expert guided tours through Thailand\'s natural wonders',
                'price_range' => '$$',
                'website' => 'https://thaiadventuretours.com',
                'email' => 'bookings@thaiadventuretours.com',
                'phone' => '+66-2-987-6543',
                'lat' => 13.7563,
                'lng' => 100.5018,
                'is_approved' => true,
            ],
            [
                'country_id' => 2, // Bali
                'name' => 'Bali Green Restaurant',
                'type' => 'restaurant',
                'description' => 'Organic farm-to-table dining experience',
                'price_range' => '$$',
                'website' => 'https://baligreenrestaurant.com',
                'email' => 'reservations@baligreenrestaurant.com',
                'phone' => '+62-361-123-456',
                'lat' => -8.3405,
                'lng' => 115.0920,
                'is_approved' => true,
            ],
            [
                'country_id' => 3, // Costa Rica
                'name' => 'Costa Rica Wildlife Lodge',
                'type' => 'accommodation',
                'description' => 'Eco-lodge in the heart of the rainforest',
                'price_range' => '$$$',
                'website' => 'https://costaricawildlifelodge.com',
                'email' => 'stay@costaricawildlifelodge.com',
                'phone' => '+506-2-123-4567',
                'lat' => 9.9281,
                'lng' => -84.0907,
                'is_approved' => true,
            ],
            [
                'country_id' => 4, // New Zealand
                'name' => 'NZ Adventure Co.',
                'type' => 'activity',
                'description' => 'Thrilling outdoor adventures across New Zealand',
                'price_range' => '$$',
                'website' => 'https://nzadventure.co',
                'email' => 'book@nzadventure.co',
                'phone' => '+64-9-123-4567',
                'lat' => -40.9006,
                'lng' => 174.8860,
                'is_approved' => true,
            ],
            [
                'country_id' => 5, // Norway
                'name' => 'Northern Lights Tours',
                'type' => 'tour_operator',
                'description' => 'Aurora borealis viewing and photography tours',
                'price_range' => '$$$',
                'website' => 'https://northernlightstours.no',
                'email' => 'info@northernlightstours.no',
                'phone' => '+47-123-45678',
                'lat' => 60.4720,
                'lng' => 8.4689,
                'is_approved' => false,
            ],
        ];

        foreach ($serviceProviders as $providerData) {
            ServiceProvider::create($providerData);
        }

        // Attach themes to service providers
        $providers = ServiceProvider::all();
        $themes = Theme::all();

        // Bangkok Eco Resort - Eco-Tourism, Wellness & Spa
        $providers[0]->themes()->attach([$themes[1]->id, $themes[6]->id]);

        // Thai Adventure Tours - Adventure, Mountain & Hiking
        $providers[1]->themes()->attach([$themes[0]->id, $themes[4]->id]);

        // Bali Green Restaurant - Food & Culinary, Cultural Heritage
        $providers[2]->themes()->attach([$themes[7]->id, $themes[2]->id]);

        // Costa Rica Wildlife Lodge - Wildlife & Nature, Eco-Tourism
        $providers[3]->themes()->attach([$themes[5]->id, $themes[1]->id]);

        // NZ Adventure Co. - Adventure, Mountain & Hiking
        $providers[4]->themes()->attach([$themes[0]->id, $themes[4]->id]);

        // Northern Lights Tours - Photography, Adventure
        $providers[5]->themes()->attach([$themes[8]->id, $themes[0]->id]);
    }
} 