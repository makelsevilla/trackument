<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DocumentController;

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
    // check the user type then redirect
    $user = auth()->user();
    if ($user) {
        if ($user->role === "admin") {
            return redirect()->route("admin.document-transfers.index");
        } else {
            return redirect()->route("documents.lists.actionable");
        }
    }

    return to_route("login");
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

Route::middleware(["auth", "role:user"])->group(function () {
    Route::resource("documents", DocumentController::class)->except(["create"]);
    Route::put("/documents/{document}/finalize", [
        \App\Http\Controllers\DocumentController::class,
        "finalize",
    ])->name("documents.finalize");
    Route::put("/documents/{document}/updateNotifyOwner", [
        \App\Http\Controllers\DocumentController::class,
        "updateNotifyOwner",
    ])->name("documents.updateNotifyOwner");

    Route::resource(
        "document_files",
        \App\Http\Controllers\DocumentFileController::class
    )->only(["index", "store", "destroy"]);

    Route::get("/download/{document_file}", [
        \App\Http\Controllers\FileController::class,
        "download",
    ])->name("file.download");

    /*    Route::get("/track", [
        \App\Http\Controllers\TrackingController::class,
        "track",
    ])->name("track");*/

    Route::get("/history/{tracking_code}", [
        \App\Http\Controllers\TrackingController::class,
        "history",
    ])->name("track");

    Route::get("/badgeCounts", [
        \App\Http\Controllers\BadgeController::class,
        "getBadgeCounts",
    ])->name("badgeCounts");

    require __DIR__ . "/notifications.php";
    require __DIR__ . "/document/terminate.php";
    require __DIR__ . "/document/transfer.php";
    require __DIR__ . "/documentslists.php";
});

require __DIR__ . "/auth.php";
require __DIR__ . "/admin.php";
