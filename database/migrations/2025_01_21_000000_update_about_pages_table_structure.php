<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if table exists
        if (Schema::hasTable('about_pages')) {
            // First, add the new values column if it doesn't exist
            if (!Schema::hasColumn('about_pages', 'values')) {
                Schema::table('about_pages', function (Blueprint $table) {
                    $table->json('values')->nullable()->after('values_title');
                });
            }
            
            // Then drop old columns in separate operations to avoid issues
            Schema::table('about_pages', function (Blueprint $table) {
                // Drop old value columns if they exist
                $columnsToDrop = [];
                if (Schema::hasColumn('about_pages', 'value_1_title')) {
                    $columnsToDrop = array_merge($columnsToDrop, ['value_1_title', 'value_1_description']);
                }
                if (Schema::hasColumn('about_pages', 'value_2_title')) {
                    $columnsToDrop = array_merge($columnsToDrop, ['value_2_title', 'value_2_description']);
                }
                if (Schema::hasColumn('about_pages', 'value_3_title')) {
                    $columnsToDrop = array_merge($columnsToDrop, ['value_3_title', 'value_3_description']);
                }
                if (!empty($columnsToDrop)) {
                    $table->dropColumn($columnsToDrop);
                }
            });
            
            Schema::table('about_pages', function (Blueprint $table) {
                // Drop old impact stat label columns if they exist
                $columnsToDrop = [];
                if (Schema::hasColumn('about_pages', 'impact_stat_1_label')) {
                    $columnsToDrop = array_merge($columnsToDrop, ['impact_stat_1_label', 'impact_stat_2_label', 'impact_stat_3_label', 'impact_stat_4_label']);
                }
                if (!empty($columnsToDrop)) {
                    $table->dropColumn($columnsToDrop);
                }
            });
            
            Schema::table('about_pages', function (Blueprint $table) {
                // Drop CTA button columns if they exist
                $columnsToDrop = [];
                if (Schema::hasColumn('about_pages', 'cta_button_1_text')) {
                    $columnsToDrop = array_merge($columnsToDrop, ['cta_button_1_text', 'cta_button_1_link', 'cta_button_2_text', 'cta_button_2_link']);
                }
                if (!empty($columnsToDrop)) {
                    $table->dropColumn($columnsToDrop);
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('about_pages')) {
            Schema::table('about_pages', function (Blueprint $table) {
                // Restore old structure if needed
                if (Schema::hasColumn('about_pages', 'values')) {
                    $table->dropColumn('values');
                }
                
                $table->string('value_1_title')->nullable();
                $table->text('value_1_description')->nullable();
                $table->string('value_2_title')->nullable();
                $table->text('value_2_description')->nullable();
                $table->string('value_3_title')->nullable();
                $table->text('value_3_description')->nullable();
                
                $table->string('impact_stat_1_label')->nullable();
                $table->string('impact_stat_2_label')->nullable();
                $table->string('impact_stat_3_label')->nullable();
                $table->string('impact_stat_4_label')->nullable();
                
                $table->string('cta_button_1_text')->nullable();
                $table->string('cta_button_1_link')->nullable();
                $table->string('cta_button_2_text')->nullable();
                $table->string('cta_button_2_link')->nullable();
            });
        }
    }
};

