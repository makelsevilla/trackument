<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix("/admin")
    ->name("admin.")
    ->middleware(["auth", "role:admin"])
    ->group(function () {
        Route::get("/", function () {
            return redirect()->route("admin.dashboard");
        });

        Route::get(
            "/dashboard",
            "App\Http\Controllers\DashboardController@admin"
        )->name("dashboard");

        Route::resource(
            "/document-transfers",
            App\Http\Controllers\Admin\DocumentTransferController::class
        )->parameter("document-transfers", "documentTransfer");

        Route::post("/users/{user}/restore", [
            \App\Http\Controllers\Admin\UserController::class,
            "restore",
        ])
            ->name("users.restore")
            ->withTrashed();

        Route::get("/users/deleted", [
            \App\Http\Controllers\Admin\UserController::class,
            "deleted",
        ])->name("users.deleted");

        Route::resource(
            "/users",
            App\Http\Controllers\Admin\UserController::class
        )->withTrashed(["destroy"]);

        Route::resource(
            "/documents",
            App\Http\Controllers\Admin\DocumentController::class
        );

        Route::resource(
            "/document-types",
            App\Http\Controllers\Admin\DocumentTypeController::class
        )->parameter("document-types", "documentType");

        Route::resource(
            "/document-purposes",
            App\Http\Controllers\Admin\DocumentPurposeController::class
        )->parameter("document-purposes", "id");

        Route::resource(
            "/document-release-actions",
            App\Http\Controllers\Admin\DocumentReleaseActionController::class
        )->parameter("document-release-actions", "id");
    });
