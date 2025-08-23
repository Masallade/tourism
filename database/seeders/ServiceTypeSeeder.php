<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            'Accommodation',
            'Restaurant',
            'Tour Operator',
            'Volunteering',
            'Activity',
            'Eco-Tourism',
            'Cultural Heritage',
            'Beach & Water Sports',
            'Mountain & Hiking',
            'Wildlife & Nature',
            'Wellness & Spa',
            'Food & Culinary',
            'Photography',
        ];
        foreach ($types as $type) {
            \DB::table('service_types')->updateOrInsert(['name' => $type]);
        }
    }
}
