<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->boolean('is_top_destination')->default(false)->after('lng');
            $table->boolean('is_popular_stay')->default(false)->after('is_top_destination');
            $table->boolean('is_top_experience')->default(false)->after('is_popular_stay');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['is_top_destination', 'is_popular_stay', 'is_top_experience']);
        });
    }
};
