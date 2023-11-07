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
import dayjs from "dayjs";

import Breadcrumb from "@/Components/Breadcrumb.jsx";
import { Link, useForm } from "@inertiajs/react";
import TablePaginationButtons from "@/Components/TablePaginationButtons.jsx";
import TableFilter from "@/Components/TableFilter.jsx";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog.jsx";
import { Input } from "@/Components/ui/input.jsx";
import InputError from "@/Components/InputError.jsx";

export default function DocumentPurposesList({
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
        purpose: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("admin.document-purposes.store"));
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
                            label: "Document Purpose",
                        },
                    ]}
                />
                <DashboardHeader heading="Manage Document Purposes">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Icons.plus className="mr-2 h-4 w-4" />
                                Add Document Purpose
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <form onSubmit={handleSubmit}>
                                <DialogHeader>
                                    <DialogTitle>
                                        Create Purpose Entry
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="p-4">
                                    <Input
                                        value={formData.purpose}
                                        onChange={(e) =>
                                            setFormData(
                                                "purpose",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Purpose Name"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.purpose}
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
                        url={route("admin.document-purposes.index")}
                        categories={[{ value: "purpose", label: "Purpose" }]}
                    />

                    {/*Table Data*/}
                    <DocumentPurposesTable documentPurposes={data} />

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

function DocumentPurposesTable({ documentPurposes }) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-secondary">
                    <TableHead>Purpose</TableHead>
                    <TableHead>Delete</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {documentPurposes.map((dp, idx) => (
                    <TableRow key={idx}>
                        <TableCell>{dp.purpose}</TableCell>
                        <TableCell>
                            <Button variant="ghost" size="icon" asChild>
                                <Link
                                    href={route(
                                        "admin.document-purposes.destroy",
                                        { id: dp.id },
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
