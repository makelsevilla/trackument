<?php

use \Illuminate\Support\Facades\Route;

Route::prefix('/documents')->name('documents.')->group(function () {
    Route::prefix('/lists')->name('lists.')->group(function () {

        Route::get('/drafts', [\App\Http\Controllers\DocumentListController::class, 'drafts'])->name('drafts');
        Route::get('/finalized', [\App\Http\Controllers\DocumentListController::class, 'finalized'])->name('finalized');
        Route::get('/incoming', [\App\Http\Controllers\DocumentListController::class, 'incoming'])->name('incoming');
        Route::get('/outgoing', [\App\Http\Controllers\DocumentListController::class, 'outgoing'])->name('outgoing');
//        Route::get('/archived', [\App\Http\Controllers\DocumentListController::class, 'archived'])->name('archived');
//        Route::get('/trash', [\App\Http\Controllers\DocumentListController::class, 'trash'])->name('trash');
    });
});
