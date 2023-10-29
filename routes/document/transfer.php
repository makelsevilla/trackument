<?php

use Illuminate\Support\Facades\Route;

Route::get("/documents/{document}/release", [
    \App\Http\Controllers\DocumentTransferController::class,
    "release",
])->name("documents.release");

Route::get("/documents-transfer/{documentTransferId}", [
    \App\Http\Controllers\DocumentTransferController::class,
    "show",
])->name("documents.transfer.show");

Route::post("/documents/{document}/transfer", [
    \App\Http\Controllers\DocumentTransferController::class,
    "transfer",
])->name("documents.transfer");
