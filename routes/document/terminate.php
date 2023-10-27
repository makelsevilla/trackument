<?php

use Illuminate\Support\Facades\Route;

Route::post("/documents/{document}/terminate", [
    \App\Http\Controllers\TerminateDocumentController::class,
    "terminate",
])->name("documents.terminate");

Route::post("/documents/{document}/unlock", [
    \App\Http\Controllers\TerminateDocumentController::class,
    "unlock",
])->name("documents.unlock");
