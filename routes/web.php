<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get("/test", function () {
    return Inertia::render("Test");
});

Route::get("/", function () {
    return redirect()->route("dashboard");
    /*    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);*/
});

Route::get("/dashboard", function () {
    return Inertia::render("Dashboard", [
        "navBadges" => ["incoming" => 3, "notifications" => 6],
    ]);
})
    ->middleware(["auth", "verified"])
    ->name("dashboard");

Route::middleware("auth")->group(function () {
    Route::get("/profile", [ProfileController::class, "edit"])->name(
        "profile.edit"
    );
    Route::patch("/profile", [ProfileController::class, "update"])->name(
        "profile.update"
    );
    Route::delete("/profile", [ProfileController::class, "destroy"])->name(
        "profile.destroy"
    );
});

Route::middleware(["auth"])->group(function () {
    Route::resource(
        "documents",
        \App\Http\Controllers\DocumentController::class
    )->except(["create"]);
    Route::put("/documents/{document}/finalize", [
        \App\Http\Controllers\DocumentController::class,
        "finalize",
    ])->name("documents.finalize");
    Route::resource(
        "document_files",
        \App\Http\Controllers\DocumentFileController::class
    )->only(["index", "store", "destroy"]);
    Route::get("/download/{document_file}", [
        \App\Http\Controllers\FileController::class,
        "download",
    ])->name("file.download");

    require __DIR__ . "/documentslists.php";
});

require __DIR__ . "/auth.php";
