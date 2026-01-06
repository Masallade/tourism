<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\ServiceProvider;
use App\Models\Service;
use App\Models\ServiceType;

class RestoreServiceTypeRelationships extends Seeder
{
    /**
     * Restore service type relationships for existing service providers and services
     * This assigns the first available service type to providers/services that don't have any
     */
    public function run(): void
    {
        // Get first available service type
        $defaultServiceType = ServiceType::first();
        
        if (!$defaultServiceType) {
            $this->command->warn('No service types available. Please run ServiceTypeSeeder first.');
            return;
        }
        
        $this->command->info('Restoring service type relationships...');
        
        // Restore for service providers
        $providers = ServiceProvider::all();
        $providerCount = 0;
        
        foreach ($providers as $provider) {
            $existingRelations = DB::table('service_provider_service_type')
                ->where('service_provider_id', $provider->id)
                ->count();
            
            if ($existingRelations == 0) {
                DB::table('service_provider_service_type')->insert([
                    'service_provider_id' => $provider->id,
                    'service_type_id' => $defaultServiceType->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $providerCount++;
            }
        }
        
        $this->command->info("Assigned default service type to {$providerCount} service providers.");
        
        // Restore for services
        $services = Service::all();
        $serviceCount = 0;
        
        foreach ($services as $service) {
            $existingRelations = DB::table('service_service_type')
                ->where('service_id', $service->id)
                ->count();
            
            if ($existingRelations == 0) {
                DB::table('service_service_type')->insert([
                    'service_id' => $service->id,
                    'service_type_id' => $defaultServiceType->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $serviceCount++;
            }
        }
        
        $this->command->info("Assigned default service type to {$serviceCount} services.");
        $this->command->info('Done! Please review and update service types manually for accurate assignments.');
    }
}




