<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Mail\MailManager;
use App\Mail\Transport\SendGridTransport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register SendGrid transport
        $this->app->make(MailManager::class)->extend('sendgrid', function (array $config) {
            $apiKey = config('services.sendgrid.api_key');
            
            if (!$apiKey) {
                throw new \Exception('SendGrid API key is not configured. Please set SENDGRID_API_KEY in your .env file.');
            }
            
            return new SendGridTransport($apiKey);
        });
    }
}
