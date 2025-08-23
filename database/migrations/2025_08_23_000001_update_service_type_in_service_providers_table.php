<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('service_providers', function (Blueprint $table) {
            if (Schema::hasColumn('service_providers', 'type')) {
                $table->dropColumn('type');
            }
        });
        // Add foreign key constraint for service_type_id only
        Schema::table('service_providers', function (Blueprint $table) {
            $table->foreign('service_type_id')->references('id')->on('service_types')->nullOnDelete();
        });
    }

    public function down() {
        Schema::table('service_providers', function (Blueprint $table) {
            $table->dropForeign(['service_type_id']);
            $table->dropColumn('service_type_id');
            $table->enum('type', ['accommodation', 'restaurant', 'tour_operator', 'volunteering', 'activity'])->after('country_id');
        });
    }
};
