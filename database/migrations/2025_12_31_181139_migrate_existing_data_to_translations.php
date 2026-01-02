<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Migrate existing service_types data
        // Copy existing 'name' to 'name_en' for all service types
        DB::table('service_types')->get()->each(function ($serviceType) {
            DB::table('service_types')
                ->where('id', $serviceType->id)
                ->update([
                    'name_en' => $serviceType->name,
                ]);
        });

        // Migrate existing themes data
        // Copy existing 'name' to 'name_en' for all themes
        DB::table('themes')->get()->each(function ($theme) {
            DB::table('themes')
                ->where('id', $theme->id)
                ->update([
                    'name_en' => $theme->name,
                ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Copy name_en back to name if needed
        DB::table('service_types')->get()->each(function ($serviceType) {
            if ($serviceType->name_en) {
                DB::table('service_types')
                    ->where('id', $serviceType->id)
                    ->update([
                        'name' => $serviceType->name_en,
                    ]);
            }
        });

        DB::table('themes')->get()->each(function ($theme) {
            if ($theme->name_en) {
                DB::table('themes')
                    ->where('id', $theme->id)
                    ->update([
                        'name' => $theme->name_en,
                    ]);
            }
        });
    }
};
