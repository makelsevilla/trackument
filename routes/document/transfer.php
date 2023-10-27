<?php

use Illuminate\Support\Facades\Route;

Route::get("/documents/{document}/release", [
    \App\Http\Controllers\DocumentTransferController::class,
    "release",
])->name("documents.release");

Route::get("/documents/{document}/receive", [
    \App\Http\Controllers\DocumentTransferController::class,
    "receive",
])->name("documents.release");

Route::post("/documents/{document}/transfer", [
    \App\Http\Controllers\DocumentTransferController::class,
    "transfer",
])->name("documents.transfer");
