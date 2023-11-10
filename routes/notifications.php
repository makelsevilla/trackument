<?php
use Illuminate\Support\Facades\Route;

Route::get("/notifications", [
    \App\Http\Controllers\NotificationController::class,
    "index",
])->name("notifications.index");

Route::patch("/notifications/markAsRead", [
    \App\Http\Controllers\NotificationController::class,
    "markAsRead",
])->name("notifications.markAsRead");

Route::patch("/notifications/markAllAsRead", [
    \App\Http\Controllers\NotificationController::class,
    "markAllAsRead",
])->name("notifications.markAllAsRead");

Route::patch("/notifications/markAsUnread", [
    \App\Http\Controllers\NotificationController::class,
    "markAsUnread",
])->name("notifications.markAsUnread");

Route::delete("/notifications", [
    \App\Http\Controllers\NotificationController::class,
    "destroy",
])->name("notifications.destroy");
