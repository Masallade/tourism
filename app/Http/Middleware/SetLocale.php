<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Get locale from request header or query parameter
        $locale = $request->header('Accept-Language', 'en');
        $locale = $request->query('locale', $locale);
        
        // Extract language code if full locale is provided (e.g., "en-US" -> "en")
        if (strpos($locale, '-') !== false) {
            $locale = substr($locale, 0, strpos($locale, '-'));
        }
        
        // Validate locale
        if (in_array($locale, ['en', 'es', 'fr'])) {
            App::setLocale($locale);
        } else {
            App::setLocale('en'); // Default to English
        }
        
        return $next($request);
    }
}



