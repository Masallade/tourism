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
        DB::table('provider_theme')->delete();
        // Remove all themes
        Theme::query()->delete();

        // Add all themes with translations from client document
        $themes = [
            ['name' => 'Eco-lodges', 'name_en' => 'Eco-lodges', 'name_fr' => 'Écolodges', 'name_es' => 'Ecolodges', 'image_url' => 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Green hotels', 'name_en' => 'Green hotels', 'name_fr' => 'Hôtels écoresponsables', 'name_es' => 'Hoteles ecológicos', 'image_url' => 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Nature retreats', 'name_en' => 'Nature retreats', 'name_fr' => 'Retraites nature', 'name_es' => 'Retiros en la naturaleza', 'image_url' => 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'National parks', 'name_en' => 'National parks', 'name_fr' => 'Parcs nationaux', 'name_es' => 'Parques nacionales', 'image_url' => 'https://images.unsplash.com/photo-1465101178521-c1a4c8a0a8b7?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Wildlife safaris', 'name_en' => 'Wildlife safaris', 'name_fr' => 'Safaris animaliers', 'name_es' => 'Safaris de fauna', 'image_url' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Birdwatching', 'name_en' => 'Birdwatching', 'name_fr' => 'Observation des oiseaux', 'name_es' => 'Avistamiento de aves', 'image_url' => 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Marine reserves', 'name_en' => 'Marine reserves', 'name_fr' => 'Réserves marines', 'name_es' => 'Reservas marinas', 'image_url' => 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Coral reef friendly', 'name_en' => 'Coral reef friendly', 'name_fr' => 'Respectueux des récifs coralliens', 'name_es' => 'Respetuoso con los arrecifes de coral', 'image_url' => 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Beach cleanups', 'name_en' => 'Beach cleanups', 'name_fr' => 'Nettoyages de plages', 'name_es' => 'Limpiezas de playas', 'image_url' => 'https://images.unsplash.com/photo-1465101178521-c1a4c8a0a8b7?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Low-impact hiking', 'name_en' => 'Low-impact hiking', 'name_fr' => 'Randonnée à faible impact', 'name_es' => 'Senderismo de bajo impacto', 'image_url' => 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Cycling holidays', 'name_en' => 'Cycling holidays', 'name_fr' => 'Séjours à vélo', 'name_es' => 'Vacaciones en bicicleta', 'image_url' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Train travel', 'name_en' => 'Train travel', 'name_fr' => 'Voyages en train', 'name_es' => 'Viajes en tren', 'image_url' => 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Car-free trips', 'name_en' => 'Car-free trips', 'name_fr' => 'Séjours sans voiture', 'name_es' => 'Viajes sin coche', 'image_url' => 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Slow travel', 'name_en' => 'Slow travel', 'name_fr' => 'Slow travel', 'name_es' => 'Viajes lentos', 'image_url' => 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Off-grid cabins', 'name_en' => 'Off-grid cabins', 'name_fr' => 'Cabanes en autonomie', 'name_es' => 'Cabañas autosuficientes', 'image_url' => 'https://images.unsplash.com/photo-1465101178521-c1a4c8a0a8b7?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Tiny houses', 'name_en' => 'Tiny houses', 'name_fr' => 'Tiny houses', 'name_es' => 'Casas diminutas', 'image_url' => 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Farm stays', 'name_en' => 'Farm stays', 'name_fr' => 'Séjours à la ferme', 'name_es' => 'Estancias en granja', 'image_url' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Agritourism', 'name_en' => 'Agritourism', 'name_fr' => 'Agrotourisme', 'name_es' => 'Agroturismo', 'image_url' => 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Organic farms', 'name_en' => 'Organic farms', 'name_fr' => 'Fermes biologiques', 'name_es' => 'Granjas ecológicas', 'image_url' => 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Permaculture stays', 'name_en' => 'Permaculture stays', 'name_fr' => 'Séjours en permaculture', 'name_es' => 'Estancias de permacultura', 'image_url' => 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Community-based tourism', 'name_en' => 'Community-based tourism', 'name_fr' => 'Tourisme communautaire', 'name_es' => 'Turismo comunitario', 'image_url' => 'https://images.unsplash.com/photo-1465101178521-c1a4c8a0a8b7?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Homestays', 'name_en' => 'Homestays', 'name_fr' => 'Chez l\'habitant', 'name_es' => 'Alojamiento en casas particulares', 'image_url' => 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Village life', 'name_en' => 'Village life', 'name_fr' => 'Vie de village', 'name_es' => 'Vida de pueblo', 'image_url' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Cultural immersion', 'name_en' => 'Cultural immersion', 'name_fr' => 'Immersion culturelle', 'name_es' => 'Inmersión cultural', 'image_url' => 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Indigenous tourism', 'name_en' => 'Indigenous tourism', 'name_fr' => 'Tourisme autochtone', 'name_es' => 'Turismo indígena', 'image_url' => 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Fair-trade tourism', 'name_en' => 'Fair-trade tourism', 'name_fr' => 'Tourisme équitable', 'name_es' => 'Turismo de comercio justo', 'image_url' => 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Regenerative tourism', 'name_en' => 'Regenerative tourism', 'name_fr' => 'Tourisme régénératif', 'name_es' => 'Turismo regenerativo', 'image_url' => 'https://images.unsplash.com/photo-1465101178521-c1a4c8a0a8b7?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Carbon-neutral trips', 'name_en' => 'Carbon-neutral trips', 'name_fr' => 'Voyages neutres en carbone', 'name_es' => 'Viajes neutros en carbono', 'image_url' => 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Renewable energy lodges', 'name_en' => 'Renewable energy lodges', 'name_fr' => 'Hébergements à énergie renouvelable', 'name_es' => 'Alojamientos con energía renovable', 'image_url' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Zero-waste stays', 'name_en' => 'Zero-waste stays', 'name_fr' => 'Séjours zéro déchet', 'name_es' => 'Estancias cero residuos', 'image_url' => 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Plastic-free stays', 'name_en' => 'Plastic-free stays', 'name_fr' => 'Séjours sans plastique', 'name_es' => 'Estancias sin plástico', 'image_url' => 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Local food', 'name_en' => 'Local food', 'name_fr' => 'Cuisine locale', 'name_es' => 'Cocina local', 'image_url' => 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Farm-to-table', 'name_en' => 'Farm-to-table', 'name_fr' => 'Du producteur à l\'assiette', 'name_es' => 'De la granja a la mesa', 'image_url' => 'https://images.unsplash.com/photo-1465101178521-c1a4c8a0a8b7?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Vegetarian / vegan stays', 'name_en' => 'Vegetarian / vegan stays', 'name_fr' => 'Séjours végétariens / végans', 'name_es' => 'Estancias vegetarianas / veganas', 'image_url' => 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Locavore cuisine', 'name_en' => 'Locavore cuisine', 'name_fr' => 'Cuisine locavore', 'name_es' => 'Cocina locávora', 'image_url' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Eco-spa retreats', 'name_en' => 'Eco-spa retreats', 'name_fr' => 'Retraites spa écoresponsables', 'name_es' => 'Retiros de spa ecológicos', 'image_url' => 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Wellness & nature', 'name_en' => 'Wellness & nature', 'name_fr' => 'Bien-être et nature', 'name_es' => 'Bienestar y naturaleza', 'image_url' => 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Dark-sky tourism', 'name_en' => 'Dark-sky tourism', 'name_fr' => 'Tourisme des « ciels étoilés »', 'name_es' => 'Turismo de cielos oscuros', 'image_url' => 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Rewilding projects', 'name_en' => 'Rewilding projects', 'name_fr' => 'Projets de réensauvagement', 'name_es' => 'Proyectos de resilvestración', 'image_url' => 'https://images.unsplash.com/photo-1465101178521-c1a4c8a0a8b7?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Wildlife conservation trips', 'name_en' => 'Wildlife conservation trips', 'name_fr' => 'Voyages de conservation de la faune', 'name_es' => 'Viajes de conservación de la fauna', 'image_url' => 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Voluntourism (ethical)', 'name_en' => 'Voluntourism (ethical)', 'name_fr' => 'Volontourisme éthique', 'name_es' => 'Volunturismo ético', 'image_url' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Educational eco-tours', 'name_en' => 'Educational eco-tours', 'name_fr' => 'Écotours éducatifs', 'name_es' => 'Ecotours educativos', 'image_url' => 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Sustainable city breaks', 'name_en' => 'Sustainable city breaks', 'name_fr' => 'City-breaks durables', 'name_es' => 'Escapadas urbanas sostenibles', 'image_url' => 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Green city tours', 'name_en' => 'Green city tours', 'name_fr' => 'Visites urbaines « vertes »', 'name_es' => 'Tours urbanos verdes', 'image_url' => 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Responsible cruising', 'name_en' => 'Responsible cruising', 'name_fr' => 'Croisières responsables', 'name_es' => 'Cruceros responsables', 'image_url' => 'https://images.unsplash.com/photo-1465101178521-c1a4c8a0a8b7?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Protected areas', 'name_en' => 'Protected areas', 'name_fr' => 'Aires protégées', 'name_es' => 'Áreas protegidas', 'image_url' => 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'Biosphere reserves', 'name_en' => 'Biosphere reserves', 'name_fr' => 'Réserves de biosphère', 'name_es' => 'Reservas de la biosfera', 'image_url' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80'],
            ['name' => 'UNESCO nature sites', 'name_en' => 'UNESCO nature sites', 'name_fr' => 'Sites naturels UNESCO', 'name_es' => 'Sitios naturales de la UNESCO', 'image_url' => 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80'],
        ];

        foreach ($themes as $theme) {
            Theme::create($theme);
        }
    }
}
