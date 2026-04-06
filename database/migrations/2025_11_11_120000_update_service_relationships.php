<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_service_type', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->onDelete('cascade');
            $table->foreignId('service_type_id')->constrained()->onDelete('cascade');
            $table->unique(['service_id', 'service_type_id']);
            $table->timestamps();
        });

        Schema::create('service_theme', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->onDelete('cascade');
            $table->foreignId('theme_id')->constrained()->onDelete('cascade');
            $table->unique(['service_id', 'theme_id']);
            $table->timestamps();
        });

        if (Schema::hasColumn('services', 'service_type_id')) {
            $serviceTypeRows = DB::table('services')
                ->select('id', 'service_type_id')
                ->whereNotNull('service_type_id')
                ->get();

            foreach ($serviceTypeRows as $row) {
                DB::table('service_service_type')->insert([
                    'service_id' => $row->id,
                    'service_type_id' => $row->service_type_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            Schema::table('services', function (Blueprint $table) {
                $table->dropForeign(['service_type_id']);
                $table->dropColumn('service_type_id');
            });
        }

        if (Schema::hasColumn('services', 'theme_id')) {
            $serviceThemeRows = DB::table('services')
                ->select('id', 'theme_id')
                ->whereNotNull('theme_id')
                ->get();

            foreach ($serviceThemeRows as $row) {
                DB::table('service_theme')->insert([
                    'service_id' => $row->id,
                    'theme_id' => $row->theme_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            Schema::table('services', function (Blueprint $table) {
                $table->dropForeign(['theme_id']);
                $table->dropColumn('theme_id');
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasColumn('services', 'service_type_id')) {
            Schema::table('services', function (Blueprint $table) {
                $table->unsignedBigInteger('service_type_id')->nullable()->after('provider_id');
            });

            $serviceTypeRows = DB::table('service_service_type')
                ->select('service_id', 'service_type_id')
                ->orderBy('created_at')
                ->get()
                ->groupBy('service_id');

            foreach ($serviceTypeRows as $serviceId => $rows) {
                $serviceTypeId = $rows->first()->service_type_id ?? null;
                DB::table('services')
                    ->where('id', $serviceId)
                    ->update(['service_type_id' => $serviceTypeId]);
            }

            Schema::table('services', function (Blueprint $table) {
                $table->foreign('service_type_id')->references('id')->on('service_types')->onDelete('cascade');
            });
        }

        if (!Schema::hasColumn('services', 'theme_id')) {
            Schema::table('services', function (Blueprint $table) {
                $table->unsignedBigInteger('theme_id')->nullable()->after('service_type_id');
            });

            $serviceThemeRows = DB::table('service_theme')
                ->select('service_id', 'theme_id')
                ->orderBy('created_at')
                ->get()
                ->groupBy('service_id');

            foreach ($serviceThemeRows as $serviceId => $rows) {
                $themeId = $rows->first()->theme_id ?? null;
                DB::table('services')
                    ->where('id', $serviceId)
                    ->update(['theme_id' => $themeId]);
            }

            Schema::table('services', function (Blueprint $table) {
                $table->foreign('theme_id')->references('id')->on('themes')->onDelete('set null');
            });
        }

        Schema::dropIfExists('service_service_type');
        Schema::dropIfExists('service_theme');
    }
};

