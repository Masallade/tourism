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
        Schema::table('destinations', function (Blueprint $table) {
            // Add country_id column if it doesn't exist
            if (!Schema::hasColumn('destinations', 'country_id')) {
                $table->unsignedBigInteger('country_id')->nullable()->after('display_order');
                $table->foreign('country_id')->references('id')->on('countries')->onDelete('set null');
            }
            
            // Add description column if it doesn't exist
            if (!Schema::hasColumn('destinations', 'description')) {
                $table->text('description')->nullable()->after('subtitle');
            }
            
            // Add images column if it doesn't exist
            if (!Schema::hasColumn('destinations', 'images')) {
                $table->json('images')->nullable()->after('description');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('destinations', function (Blueprint $table) {
            // Drop foreign key first
            if (Schema::hasColumn('destinations', 'country_id')) {
                $table->dropForeign(['country_id']);
                $table->dropColumn('country_id');
            }
            
            if (Schema::hasColumn('destinations', 'description')) {
                $table->dropColumn('description');
            }
            
            if (Schema::hasColumn('destinations', 'images')) {
                $table->dropColumn('images');
            }
        });
    }
};
