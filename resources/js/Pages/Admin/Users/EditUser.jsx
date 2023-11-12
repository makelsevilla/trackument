import AdminLayout from "@/Layouts/AdminLayout.jsx";
import DashboardHeader from "@/Components/DashboardHeader.jsx";
import { Button } from "@/Components/ui/button.jsx";
import Icons from "@/Components/Icons.jsx";
import Breadcrumb from "@/Components/Breadcrumb.jsx";
import { Input } from "@/Components/ui/input.jsx";
import InputError from "@/Components/InputError.jsx";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group.jsx";
import { Label } from "@/Components/ui/label.jsx";

export default function EditUser({ auth, user }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name || "",
        username: user.username || "",
        new_password: "",
        new_password_confirmation: "",
        role: user.role || "",
    });

    useEffect(() => {
        return () => {
            reset("new_password", "new_password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        put(route("admin.users.update", { user: user.id }));
    };

    return (
        <AdminLayout user={auth.user}>
            <div className="flex flex-col justify-start gap-8">
                <Breadcrumb
                    items={[
                        {
                            label: "Home",
                            href: route("admin.dashboard"),
                        },
                        {
                            label: "User Management",
                            href: route("admin.users.index"),
                        },
                        {
                            label: "Edit",
                        },
                    ]}
                />
                <DashboardHeader heading="Edit User" />
                {/*Content*/}
                <div className="p-2">
                    <form className="max-w-md" onSubmit={submit}>
                        <div className="grid gap-1.5">
                            <Label htmlFor="name">
                                Office Name{" "}
                                <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                type="text"
                                name="name"
                                id="name"
                                className="block w-full"
                                autoComplete="name"
                                required
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="mt-4 grid gap-1.5">
                            <Label htmlFor="username">
                                Username <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                value={data.username}
                                onChange={(e) =>
                                    setData("username", e.target.value)
                                }
                                name="username"
                                id="username"
                                className="block w-full"
                                autoComplete="username"
                                required
                            />
                            <InputError message={errors.username} />
                        </div>
                        <div className="mt-4 grid gap-1.5">
                            <Label htmlFor="new_password">New Password</Label>
                            <Input
                                value={data.new_password}
                                onChange={(e) =>
                                    setData("new_password", e.target.value)
                                }
                                type="password"
                                name="new_password"
                                id="new_password"
                                className="block w-full"
                                autoComplete="new-password"
                            />
                            <InputError message={errors.new_password} />
                        </div>
                        <div className="mt-4 grid gap-1.5">
                            <Label htmlFor="new_password_confirmation">
                                Confirm Password
                            </Label>
                            <Input
                                value={data.new_password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "new_password_confirmation",
                                        e.target.value,
                                    )
                                }
                                type="password"
                                name="new_password_confirmation"
                                id="new_password_confirmation"
                                className="block w-full"
                                autoComplete="new-password"
                            />
                            <InputError
                                message={errors.new_password_confirmation}
                            />
                        </div>
                        <div className="mt-4 grid gap-1.5">
                            <Label htmlFor="role">
                                Role: <span className="text-red-600">*</span>
                            </Label>
                            <RadioGroup
                                value={data.role}
                                onValueChange={(value) =>
                                    setData("role", value)
                                }
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="user" id="user" />
                                    <Label htmlFor="user">User</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="admin" id="admin" />
                                    <Label htmlFor="admin">Admin</Label>
                                </div>
                            </RadioGroup>
                            <InputError message={errors.role} />
                        </div>
                        <div className="flex justify-end">
                            <Button disabled={processing} type="submit">
                                Update
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
