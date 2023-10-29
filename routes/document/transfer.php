<?php

use Illuminate\Support\Facades\Route;

Route::get("/documents/{document}/release", [
    \App\Http\Controllers\DocumentTransferController::class,
    "release",
])->name("documents.release");

Route::post("/documents/{document}/transfer", [
    \App\Http\Controllers\DocumentTransferController::class,
    "transfer",
])->name("documents.transfer");

Route::get("/documents-transfer/{documentTransferId}", [
    \App\Http\Controllers\DocumentTransferController::class,
    "show",
])->name("documents.transfer.show");

Route::post("/documents-transfer/{documentTransfer}/accept", [
    \App\Http\Controllers\DocumentTransferController::class,
    "accept",
])->name("documents.transfer.accept");

Route::post("/documents-transfer/{documentTransfer}/reject", [
    \App\Http\Controllers\DocumentTransferController::class,
    "reject",
])->name("documents.transfer.reject");
