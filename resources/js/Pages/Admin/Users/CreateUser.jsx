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

export default function CreateUser({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("admin.users.store"));
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
                            label: "Create",
                        },
                    ]}
                />
                <DashboardHeader heading="Create User" />
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
                            <Label htmlFor="email">
                                Email <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                type="email"
                                name="email"
                                id="email"
                                className="block w-full"
                                autoComplete="email"
                                required
                            />
                            <InputError message={errors.email} />
                        </div>
                        <div className="mt-4 grid gap-1.5">
                            <Label htmlFor="password">
                                Password <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                type="password"
                                name="password"
                                id="password"
                                className="block w-full"
                                autoComplete="new-password"
                                required
                            />
                            <InputError message={errors.password} />
                        </div>
                        <div className="mt-4 grid gap-1.5">
                            <Label htmlFor="password_confirmation">
                                Confirm Password{" "}
                                <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                                type="password"
                                name="password_confirmation"
                                id="password_confirmation"
                                className="block w-full"
                                autoComplete="new-password"
                                required
                            />
                            <InputError
                                message={errors.password_confirmation}
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
                                Create
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
