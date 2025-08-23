<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('service_providers', function (Blueprint $table) {
            // Ensure service_type_id is unsignedBigInteger and nullable
            $table->unsignedBigInteger('service_type_id')->nullable()->change();
        });
    }
    public function down() {
        Schema::table('service_providers', function (Blueprint $table) {
            $table->bigInteger('service_type_id')->change();
        });
    }
};
