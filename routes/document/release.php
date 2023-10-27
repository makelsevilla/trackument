<?php

use Illuminate\Support\Facades\Route;

Route::get("/documents/{document}/release", [
    \App\Http\Controllers\DocumentReleaseController::class,
    "release",
])->name("documents.release");

Route::post("/documents/{document}/transfer", [
    \App\Http\Controllers\DocumentReleaseController::class,
    "transfer",
])->name("documents.transfer");
