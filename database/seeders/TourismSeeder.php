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
            ],
            [
                'name' => 'Bali, Indonesia',
                'slug' => 'bali-indonesia',
                'description' => 'Island of the Gods with stunning temples and beaches',
            ],
            [
                'name' => 'Costa Rica',
                'slug' => 'costa-rica',
                'description' => 'Pura Vida! Rich biodiversity and eco-tourism',
            ],
            [
                'name' => 'New Zealand',
                'slug' => 'new-zealand',
                'description' => 'Adventure capital with stunning landscapes',
            ],
            [
                'name' => 'Norway',
                'slug' => 'norway',
                'description' => 'Land of fjords and northern lights',
            ],
        ];

        // Create countries and store them for reference
        $createdCountries = [];
        foreach ($countries as $countryData) {
            $country = Country::create($countryData);
            $createdCountries[$country->name] = $country->id;
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

        // Create Service Providers using dynamic country IDs
        $serviceProviders = [
            [
                'country_id' => $createdCountries['Thailand'],
                'name' => 'Bangkok Eco Resort',
                'type' => 'accommodation',
                'description' => 'Sustainable luxury resort in the heart of Bangkok',
                'price_range' => '$$$',
                'website' => 'https://bangkokecoresort.com',
                'email' => 'info@bangkokecoresort.com',
                'phone' => '+66-2-123-4567',
                'is_approved' => true,
            ],
            [
                'country_id' => $createdCountries['Thailand'],
                'name' => 'Thai Adventure Tours',
                'type' => 'tour_operator',
                'description' => 'Expert guided tours through Thailand\'s natural wonders',
                'price_range' => '$$',
                'website' => 'https://thaiadventuretours.com',
                'email' => 'bookings@thaiadventuretours.com',
                'phone' => '+66-2-987-6543',
                'is_approved' => true,
            ],
            [
                'country_id' => $createdCountries['Bali, Indonesia'],
                'name' => 'Bali Green Restaurant',
                'type' => 'restaurant',
                'description' => 'Organic farm-to-table dining experience',
                'price_range' => '$$',
                'website' => 'https://baligreenrestaurant.com',
                'email' => 'reservations@baligreenrestaurant.com',
                'phone' => '+62-361-123-456',
                'is_approved' => true,
            ],
            [
                'country_id' => $createdCountries['Costa Rica'],
                'name' => 'Costa Rica Wildlife Lodge',
                'type' => 'accommodation',
                'description' => 'Eco-lodge in the heart of the rainforest',
                'price_range' => '$$$',
                'website' => 'https://costaricawildlifelodge.com',
                'email' => 'stay@costaricawildlifelodge.com',
                'phone' => '+506-2-123-4567',
                'is_approved' => true,
            ],
            [
                'country_id' => $createdCountries['New Zealand'],
                'name' => 'NZ Adventure Co.',
                'type' => 'activity',
                'description' => 'Thrilling outdoor adventures across New Zealand',
                'price_range' => '$$',
                'website' => 'https://nzadventure.co',
                'email' => 'book@nzadventure.co',
                'phone' => '+64-9-123-4567',
                'is_approved' => true,
            ],
            [
                'country_id' => $createdCountries['Norway'],
                'name' => 'Northern Lights Tours',
                'type' => 'tour_operator',
                'description' => 'Aurora borealis viewing and photography tours',
                'price_range' => '$$$',
                'website' => 'https://northernlightstours.no',
                'email' => 'info@northernlightstours.no',
                'phone' => '+47-123-45678',
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