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
        Schema::table('services', function (Blueprint $table) {
            $table->unsignedSmallInteger('min_travelers')
                ->default(1)
                ->after('max_age');
            $table->unsignedSmallInteger('max_travelers')
                ->default(10)
                ->after('min_travelers');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['min_travelers', 'max_travelers']);
        });
    }
};
