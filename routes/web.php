<?php

use Illuminate\Support\Facades\Route;

// Catch-all route to handle React Router client-side routing
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
