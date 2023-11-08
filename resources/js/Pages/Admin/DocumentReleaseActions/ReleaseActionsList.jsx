import AdminLayout from "@/Layouts/AdminLayout.jsx";
import DashboardHeader from "@/Components/DashboardHeader.jsx";
import { Button } from "@/Components/ui/button.jsx";
import Icons from "@/Components/Icons.jsx";
import {
    TableHead,
    Table,
    TableHeader,
    TableRow,
    TableBody,
    TableCell,
} from "@/Components/ui/table.jsx";

import Breadcrumb from "@/Components/Breadcrumb.jsx";
import { Link, useForm } from "@inertiajs/react";
import TablePaginationButtons from "@/Components/TablePaginationButtons.jsx";
import TableFilter from "@/Components/TableFilter.jsx";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog.jsx";
import { Input } from "@/Components/ui/input.jsx";
import InputError from "@/Components/InputError.jsx";

export default function ReleaseActionsList({
    auth,
    paginate: { data, ...paginate },
}) {
    const {
        data: formData,
        setData: setFormData,
        post,
        processing,
        errors,
    } = useForm({
        action_name: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("admin.document-release-actions.store"));
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
                            label: "Release Actions",
                        },
                    ]}
                />
                <DashboardHeader heading="Manage Release Actions">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Icons.plus className="mr-2 h-4 w-4" />
                                Add Release Actions
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <form onSubmit={handleSubmit}>
                                <DialogHeader>
                                    <DialogTitle>
                                        Add Release Action Entry
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="p-4">
                                    <Input
                                        value={formData.action_name}
                                        onChange={(e) =>
                                            setFormData(
                                                "action_name",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Action Name"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.action_name}
                                    />
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="secondary">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button disabled={processing} type="submit">
                                        Create
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </DashboardHeader>

                {/*Content*/}
                <div className="flex flex-col gap-4 p-2">
                    {/*Table Filters*/}
                    <TableFilter
                        url={route("admin.document-release-actions.index")}
                        categories={[
                            { value: "action_name", label: "Action Name" },
                        ]}
                        sortColumns={[
                            { value: "action_name", label: "Action Name" },
                        ]}
                    />

                    {/*Table Data*/}
                    <ReleaseActionsTable actions={data} />

                    <div>
                        {data.length === 0 && (
                            <div className="text-center text-muted-foreground">
                                No Data Found
                            </div>
                        )}
                    </div>

                    {/*Table Footer*/}
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {paginate.from} to {paginate.to} of{" "}
                            {paginate.total} results
                        </div>
                        <TablePaginationButtons paginate={paginate} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function ReleaseActionsTable({ actions }) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-secondary">
                    <TableHead>Action Name</TableHead>
                    <TableHead>Delete</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {actions.map((action, idx) => (
                    <TableRow key={idx}>
                        <TableCell>{action.action_name}</TableCell>
                        <TableCell>
                            <Button variant="ghost" size="icon" asChild>
                                <Link
                                    href={route(
                                        "admin.document-release-actions.destroy",
                                        { id: action.id },
                                    )}
                                    method="delete"
                                    as="button"
                                >
                                    <Icons.trash className="h-4 w-4" />
                                </Link>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
