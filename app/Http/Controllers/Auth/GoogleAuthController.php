<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')
            ->with(['prompt' => 'select_account']) // Force account selection
            ->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            // Check if user already exists
            $user = User::where('email', $googleUser->getEmail())->first();
            
            if ($user) {
                // User exists, log them in
                Auth::login($user);
            } else {
                // Create new user
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'password' => bcrypt(Str::random(16)), // Random password since they'll use Google
                    'role' => 'user',
                    'email_verified_at' => now(), // Google emails are verified
                ]);
                
                Auth::login($user);
            }
            
            // Redirect to home page with success message and user data
            return redirect('/')->with('google_login_success', true)->with('user_data', [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
            ]);
            
        } catch (\Exception $e) {
            return redirect('/login')->with('error', 'Google login failed. Please try again.');
        }
    }
}

