<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->string('image_2')->nullable()->after('image');
            $table->string('image_3')->nullable()->after('image_2');
            $table->integer('min_age')->nullable()->after('image_3');
            $table->integer('max_age')->nullable()->after('min_age');
            $table->string('duration')->nullable()->after('max_age');
            $table->text('overview')->nullable()->after('description');
            $table->text('details')->nullable()->after('overview');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn([
                'image_2',
                'image_3',
                'min_age',
                'max_age',
                'duration',
                'overview',
                'details'
            ]);
        });
    }
};