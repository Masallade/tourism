<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ServiceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Disable foreign key checks temporarily
        Schema::disableForeignKeyConstraints();
        
        // Delete all relationships first (to avoid foreign key constraints)
        DB::table('service_provider_service_type')->delete();
        DB::table('service_service_type')->delete();
        
        // Delete all existing service types
        DB::table('service_types')->delete();
        
        // Re-enable foreign key checks
        Schema::enableForeignKeyConstraints();
        
        $types = [
            [
                'name' => 'Accommodation',
                'name_en' => 'Accommodation',
                'name_fr' => 'Hébergements',
                'name_es' => 'Alojamientos',
            ],
            [
                'name' => 'Eco-lodges',
                'name_en' => 'Eco-lodges',
                'name_fr' => 'Écolodges',
                'name_es' => 'Ecolodges',
            ],
            [
                'name' => 'Tours & excursions',
                'name_en' => 'Tours & excursions',
                'name_fr' => 'Visites et excursions',
                'name_es' => 'Tours y excursiones',
            ],
            [
                'name' => 'Activity provider',
                'name_en' => 'Activity provider',
                'name_fr' => 'Prestataires d\'activités',
                'name_es' => 'Proveedores de actividades',
            ],
            [
                'name' => 'Nature & wildlife tours',
                'name_en' => 'Nature & wildlife tours',
                'name_fr' => 'Circuits nature et faune sauvage',
                'name_es' => 'Tours de naturaleza y vida salvaje',
            ],
            [
                'name' => 'Hiking & trekking',
                'name_en' => 'Hiking & trekking',
                'name_fr' => 'Randonnée et trekking',
                'name_es' => 'Senderismo y trekking',
            ],
            [
                'name' => 'Water-based activities',
                'name_en' => 'Water-based activities',
                'name_fr' => 'Activités nautiques',
                'name_es' => 'Actividades náuticas',
            ],
            [
                'name' => 'Cultural experiences',
                'name_en' => 'Cultural experiences',
                'name_fr' => 'Expériences culturelles',
                'name_es' => 'Experiencias culturales',
            ],
            [
                'name' => 'Food & culinary experiences',
                'name_en' => 'Food & culinary experiences',
                'name_fr' => 'Expériences gastronomiques',
                'name_es' => 'Experiencias gastronómicas',
            ],
            [
                'name' => 'Restaurant / café',
                'name_en' => 'Restaurant / café',
                'name_fr' => 'Restaurant / café',
                'name_es' => 'Restaurante / café',
            ],
            [
                'name' => 'Winery / brewery',
                'name_en' => 'Winery / brewery',
                'name_fr' => 'Domaine viticole / brasserie',
                'name_es' => 'Bodega / cervecería',
            ],
            [
                'name' => 'Wellness & spa',
                'name_en' => 'Wellness & spa',
                'name_fr' => 'Bien-être et spa',
                'name_es' => 'Bienestar y spa',
            ],
            [
                'name' => 'Yoga & retreat center',
                'name_en' => 'Yoga & retreat center',
                'name_fr' => 'Yoga et centre de retraite',
                'name_es' => 'Yoga y centro de retiro',
            ],
            [
                'name' => 'Volunteering & conservation',
                'name_en' => 'Volunteering & conservation',
                'name_fr' => 'Volontariat et conservation',
                'name_es' => 'Voluntariado y conservación',
            ],
            [
                'name' => 'Community project / NGO',
                'name_en' => 'Community project / NGO',
                'name_fr' => 'Projet communautaire / ONG',
                'name_es' => 'Proyecto comunitario / ONG',
            ],
            [
                'name' => 'Farm stay / agritourism',
                'name_en' => 'Farm stay / agritourism',
                'name_fr' => 'Séjours à la ferme / agrotourisme',
                'name_es' => 'Estancias en granja / agroturismo',
            ],
            [
                'name' => 'Bike rental / e-bike tours',
                'name_en' => 'Bike rental / e-bike tours',
                'name_fr' => 'Location de vélos / circuits en vélo électrique',
                'name_es' => 'Alquiler de bicicletas / rutas en bicicleta eléctrica',
            ],
            [
                'name' => 'Public transport & transfers',
                'name_en' => 'Public transport & transfers',
                'name_fr' => 'Transports publics et transferts',
                'name_es' => 'Transporte público y traslados',
            ],
            [
                'name' => 'Boat & sailing trips',
                'name_en' => 'Boat & sailing trips',
                'name_fr' => 'Sorties en bateau et à la voile',
                'name_es' => 'Paseos en barco y navegación a vela',
            ],
            [
                'name' => 'Educational workshops',
                'name_en' => 'Educational workshops',
                'name_fr' => 'Ateliers pédagogiques',
                'name_es' => 'Talleres educativos',
            ],
        ];

        foreach ($types as $type) {
            DB::table('service_types')->updateOrInsert(
                ['name' => $type['name']],
                $type
            );
        }
    }
}
