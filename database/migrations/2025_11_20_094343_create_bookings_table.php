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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();

            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->foreignId('provider_id')->constrained('service_providers')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // Contact information
            $table->string('contact_first_name');
            $table->string('contact_last_name');
            $table->string('contact_email');
            $table->string('phone_country_code', 10)->nullable();
            $table->string('phone_number', 30)->nullable();
            $table->boolean('receive_sms')->default(false);

            // Activity details
            $table->date('activity_date');
            $table->time('activity_time')->nullable();
            $table->unsignedTinyInteger('travelers_adults')->default(1);
            $table->unsignedTinyInteger('travelers_children')->default(0);
            $table->string('lead_traveler_first_name');
            $table->string('lead_traveler_last_name');
            $table->string('pickup_location')->nullable();
            $table->text('special_requests')->nullable();

            // Payment preferences (no processing yet)
            $table->string('payment_timing')->default('reserve_now'); // pay_now, reserve_now
            $table->string('payment_method')->default('card');
            $table->string('promo_code')->nullable();
            $table->boolean('promo_code_applied')->default(false);

            // Financials
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->string('currency', 3)->default('USD');

            // Status & metadata
            $table->string('status')->default('pending'); // pending, confirmed, cancelled
            $table->json('form_snapshot')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
