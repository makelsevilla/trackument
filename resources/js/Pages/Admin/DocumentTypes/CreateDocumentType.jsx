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

export default function CreateDocumentType({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        abbreviation: "",
        description: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("admin.document-types.store"));
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
                            label: "Document Type",
                            href: route("admin.document-types.index"),
                        },
                        {
                            label: "Create",
                        },
                    ]}
                />
                <DashboardHeader heading="Create Document Type" />
                {/*Content*/}
                <div className="p-2">
                    <form className="max-w-md" onSubmit={submit}>
                        <div className="grid gap-1.5">
                            <Label htmlFor="name">
                                Document Type Name{" "}
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
                                required
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="mt-4 grid gap-1.5">
                            <Label htmlFor="abbreviation">
                                abbreviation{" "}
                                <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                value={data.abbreviation}
                                onChange={(e) =>
                                    setData(
                                        "abbreviation",
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                name="abbreviation"
                                id="abbreviation"
                                className="block w-full"
                                required
                            />
                            <InputError message={errors.abbreviation} />
                        </div>
                        <div className="mt-4 grid gap-1.5">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                name="description"
                                id="description"
                                className="block w-full"
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Button disabled={processing} type="submit">
                                Create Type
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
