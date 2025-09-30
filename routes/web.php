<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
})->name('welcome');

// Admin Routes for React
Route::get('/admin/login', function () {
    return view('welcome');
});

Route::get('/admin', function () {
    return view('welcome');
});

// Admin Service Provider CRUD
use App\Http\Controllers\Admin\ServiceProviderController;
Route::prefix('admin')->name('admin.')->group(function () {
    Route::resource('service-providers', ServiceProviderController::class);
});

// React Routes - Catch all routes for React Router to handle
Route::get('/country/{id}', function () {
    return view('welcome');
});

Route::get('/theme/{id}', function () {
    return view('welcome');
});

// Fallback for any other routes that should be handled by React Router
Route::get('/{path?}', function () {
    return view('welcome');
})->where('path', '.*');
