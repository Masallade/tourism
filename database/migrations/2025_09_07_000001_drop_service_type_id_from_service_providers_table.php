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
        Schema::table('service_providers', function (Blueprint $table) {
            if (Schema::hasColumn('service_providers', 'service_type_id')) {
                // Drop foreign key if exists
                try {
                    $table->dropForeign(['service_type_id']);
                } catch (\Exception $e) {}
                $table->dropColumn('service_type_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_providers', function (Blueprint $table) {
            $table->unsignedBigInteger('service_type_id')->nullable();
        });
    }
};
