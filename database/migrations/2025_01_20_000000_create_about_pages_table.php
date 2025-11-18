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
        Schema::create('about_pages', function (Blueprint $table) {
            $table->id();
            
            // Hero Section
            $table->string('hero_title')->nullable();
            $table->text('hero_subtitle')->nullable();
            
            // Mission Section
            $table->string('mission_title')->nullable();
            $table->text('mission_description')->nullable();
            $table->string('mission_image_url')->nullable();
            $table->string('mission_stat_number')->nullable();
            $table->string('mission_stat_label')->nullable();
            
            // Values Section
            $table->string('values_title')->nullable();
            $table->json('values')->nullable(); // Array of {title, description}
            
            // Impact Section
            $table->string('impact_title')->nullable();
            $table->string('impact_stat_1_number')->nullable();
            $table->string('impact_stat_1_label')->nullable();
            $table->string('impact_stat_2_number')->nullable();
            $table->string('impact_stat_2_label')->nullable();
            $table->string('impact_stat_3_number')->nullable();
            $table->string('impact_stat_3_label')->nullable();
            $table->string('impact_stat_4_number')->nullable();
            $table->string('impact_stat_4_label')->nullable();
            
            // Team Section
            $table->string('team_title')->nullable();
            $table->text('team_description')->nullable();
            $table->json('team_members')->nullable(); // Array of {name, role, image}
            
            // CTA Section
            $table->string('cta_title')->nullable();
            $table->text('cta_description')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('about_pages');
    }
};

