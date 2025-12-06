<?php

use Illuminate\Support\Facades\Route;

Route::resource('/draft', \App\Http\Controllers\DraftPicksController::class);
