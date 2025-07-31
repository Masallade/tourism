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
