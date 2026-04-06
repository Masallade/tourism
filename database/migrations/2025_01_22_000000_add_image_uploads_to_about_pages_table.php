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
        if (Schema::hasTable('about_pages')) {
            Schema::table('about_pages', function (Blueprint $table) {
                // Add hero_image column if it doesn't exist
                if (!Schema::hasColumn('about_pages', 'hero_image')) {
                    $table->string('hero_image')->nullable()->after('hero_subtitle');
                }
            });

            // Rename mission_image_url to mission_image if it exists
            if (Schema::hasColumn('about_pages', 'mission_image_url') && !Schema::hasColumn('about_pages', 'mission_image')) {
                // Use raw SQL for rename as Laravel doesn't support renameColumn in all databases
                DB::statement('ALTER TABLE `about_pages` CHANGE COLUMN `mission_image_url` `mission_image` VARCHAR(255) NULL');
            } elseif (!Schema::hasColumn('about_pages', 'mission_image')) {
                // If neither column exists, add mission_image
                Schema::table('about_pages', function (Blueprint $table) {
                    $table->string('mission_image')->nullable()->after('mission_description');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('about_pages')) {
            Schema::table('about_pages', function (Blueprint $table) {
                if (Schema::hasColumn('about_pages', 'hero_image')) {
                    $table->dropColumn('hero_image');
                }
            });

            // Rename mission_image back to mission_image_url if needed
            if (Schema::hasColumn('about_pages', 'mission_image') && !Schema::hasColumn('about_pages', 'mission_image_url')) {
                DB::statement('ALTER TABLE `about_pages` CHANGE COLUMN `mission_image` `mission_image_url` VARCHAR(255) NULL');
            }
        }
    }
};

