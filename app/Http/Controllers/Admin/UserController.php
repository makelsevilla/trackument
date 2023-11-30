<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    /**
     * Display a listing of the deleted resource.
     */

    public function deleted(Request $request)
    {
        $filters = [
            "search" => $request->query("search"),
            "category" => $request->query("category", "name"),
            "sortBy" => $request->query("sortBy", "created_at"),
            "order" => $request->query("order", "desc"),
            "perPage" => $request->query("perPage", "10"),
            "date_name" => $request->query("date_name", "created_at"),
            "date_from" => $request->query("date_from"),
            "date_to" => $request->query("date_to", now()),
            "role" => $request->query("role"),
        ];

        $users = User::onlyTrashed();

        $paginatedUsers = User::filterUsers($users, $filters);

        return Inertia::render("Admin/Users/DeletedUsers", [
            "paginatedUsers" => $paginatedUsers,
            "filters" => $filters,
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = [
            "search" => $request->query("search"),
            "category" => $request->query("category", "name"),
            "sortBy" => $request->query("sortBy", "created_at"),
            "order" => $request->query("order", "desc"),
            "perPage" => $request->query("perPage", "10"),
            "date_name" => $request->query("date_name", "created_at"),
            "date_from" => $request->query("date_from"),
            "date_to" => $request->query("date_to", now()),
            "role" => $request->query("role"),
        ];

        $users = User::whereNot("id", "=", Auth::id());

        $paginatedUsers = User::filterUsers($users, $filters);

        return Inertia::render("Admin/Users/UsersList", [
            "paginatedUsers" => $paginatedUsers,
            "filters" => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("Admin/Users/CreateUser");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "name" => "required|string|max:255",
            "username" => "required|alpha_dash|max:255|unique:" . User::class,
            "role" => "required|string|in:user,admin",
            "password" => ["required", "confirmed", Rules\Password::defaults()],
        ]);

        $user = User::create([
            "name" => $request->name,
            "username" => $request->username,
            "role" => $request->role,
            "password" => Hash::make($request->password),
        ]);

        if ($user) {
            return redirect()
                ->route("admin.users.index")
                ->with([
                    "message" => "User created successfully.",
                    "type" => "success",
                ]);
        } else {
            return redirect()
                ->back()
                ->with([
                    "message" => "User creation failed.",
                    "type" => "error",
                ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render("Admin/Users/EditUser", ["user" => $user]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            "name" => "required|string|max:255",
            "username" => [
                "required",
                "alpha_dash",
                "max:255",
                Rule::unique("users")->ignore($user->id),
            ],
            "role" => "required|string|in:user,admin",
            "new_password" => [
                "nullable",
                "confirmed",
                Rules\Password::defaults(),
            ],
        ]);

        if (isset($request->new_password)) {
            $user->password = Hash::make($request->new_password);
        }

        $isUpdated = $user->update([
            "name" => $request->name,
            "username" => $request->username,
            "role" => $request->role,
        ]);

        if ($isUpdated) {
            return redirect()
                ->route("admin.users.index")
                ->with([
                    "message" => "User update successfully.",
                    "type" => "success",
                ]);
        } else {
            return redirect()
                ->back()
                ->with([
                    "message" => "User update failed.",
                    "type" => "error",
                ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $userIsDeleted = false;
        if ($user->trashed()) {
            $userIsDeleted = $user->forceDelete();
        } else {
            $userIsDeleted = $user->delete();
        }

        if ($userIsDeleted) {
            return redirect()
                ->back()
                ->with([
                    "message" => "User deleted.",
                    "type" => "success",
                ]);
        } else {
            return redirect()
                ->back()
                ->with([
                    "message" => "User deletion failed.",
                    "type" => "error",
                ]);
        }
    }

    public function restore(User $user)
    {
        $user->restore();

        return redirect()
            ->back()
            ->with([
                "message" => "{$user->name} has been restored.",
                "type" => "success",
            ]);
    }
}
