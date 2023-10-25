<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DocumentListController;

Route::prefix("/documents")
    ->name("documents.")
    ->group(function () {
        Route::prefix("/lists")
            ->name("lists.")
            ->group(function () {
                Route::get("/drafts", [
                    DocumentListController::class,
                    "drafts",
                ])->name("drafts");
                Route::get("/finalized", [
                    DocumentListController::class,
                    "finalized",
                ])->name("finalized");
                Route::get("/actionable", [
                    DocumentListController::class,
                    "actionable",
                ])->name("actionable");
                Route::get("/incoming", [
                    DocumentListController::class,
                    "incoming",
                ])->name("incoming");
                Route::get("/outgoing", [
                    DocumentListController::class,
                    "outgoing",
                ])->name("outgoing");
            });
    });
