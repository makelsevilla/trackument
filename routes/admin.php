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

        Route::get("/dashboard", function () {
            return Inertia::render("Admin/Dashboard");
        })->name("dashboard");

        Route::resource(
            "/users",
            App\Http\Controllers\Admin\UserController::class
        );
    });
