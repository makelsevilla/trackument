<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = [
            "search" => $request->query("search"),
            "role" => $request->query("role"),
            "category" => $request->query("category"),
            "created_at" => $request->query("created_at"),
        ];

        $users = User::whereNot("id", "=", Auth::id());

        if (isset($filters["search"], $filters["category"])) {
            $users->where(
                $filters["category"],
                "LIKE",
                "%{$filters["search"]}%"
            );
        }

        if (isset($filters["role"])) {
            $users->where("role", $filters["role"]);
        }

        if (
            isset($filters["created_at"]["from"]) &&
            isset($filters["created_at"]["to"])
        ) {
            $users->whereBetween("created_at", [
                $filters["created_at"]["from"],
                $filters["created_at"]["to"],
            ]);
        }

        $paginatedUsers = $users->paginate(10)->withQueryString();

        return Inertia::render("Admin/Users/UsersList", [
            "paginatedUsers" => $paginatedUsers,
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
            "email" => "required|string|email|max:255|unique:" . User::class,
            "role" => "required|string|in:user,admin",
            "password" => ["required", "confirmed", Rules\Password::defaults()],
        ]);

        $user = User::create([
            "name" => $request->name,
            "email" => $request->email,
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
            "email" => [
                "required",
                "string",
                "email",
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
            "email" => $request->email,
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
        if ($user->delete()) {
            return redirect()
                ->route("admin.users.index")
                ->with([
                    "message" => "User deleted successfully.",
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
}
