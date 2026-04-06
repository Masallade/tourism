<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\ServiceProviderController;
use App\Http\Middleware\AdminAuth;

Route::get('/', function () {
    return view('welcome');
})->name('welcome');

// Authentication Routes
Route::prefix('api/auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::post('/register', [AuthController::class, 'register']); // Public registration
    Route::put('/profile', [AuthController::class, 'updateProfile']); // Update profile
});

// Google OAuth routes
Route::get('/auth/google', [\App\Http\Controllers\Auth\GoogleAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [\App\Http\Controllers\Auth\GoogleAuthController::class, 'handleGoogleCallback']);

// Admin Routes for React - All UI is handled in React, these routes serve the React app
Route::get('/admin/login', function () {
    return view('welcome');
});

Route::get('/admin', function () {
    return view('welcome');
})->middleware('admin.auth');

// Admin service-providers routes - redirect to React (all CRUD operations are handled via API in routes/api.php)
Route::prefix('admin')->name('admin.')->middleware('admin.auth')->group(function () {
    // All service provider CRUD is handled via API routes in routes/api.php
    // These routes redirect to React for any direct access
    Route::get('/service-providers', function () {
        return view('welcome');
    });
    Route::get('/service-providers/create', function () {
        return view('welcome');
    });
    Route::get('/service-providers/{serviceProvider}/edit', function () {
        return view('welcome');
    });
    // Approve and reject are handled via API routes (PATCH /api/service-providers/{id}/approve)
});

// React Routes - Catch all routes for React Router to handle
Route::get('/country/{id}', function () {
    return view('welcome');
});

Route::get('/theme/{id}', function () {
    return view('welcome');
});

// Privacy Policy and Terms routes
Route::get('/privacy-policy', function () {
    return view('welcome');
});

Route::get('/terms-and-conditions', function () {
    return view('welcome');
});

// Fallback for any other routes that should be handled by React Router
Route::get('/{path?}', function () {
    return view('welcome');
})->where('path', '.*');
