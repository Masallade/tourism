<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('service_providers', function (Blueprint $table) {
            // Only add foreign key constraint, do not add column
            $table->foreign('service_type_id')->references('id')->on('service_types')->nullOnDelete();
        });
    }
    public function down() {
        Schema::table('service_providers', function (Blueprint $table) {
            $table->dropForeign(['service_type_id']);
        });
    }
};
