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
import { Link } from "@inertiajs/react";
import TablePaginationButtons from "@/Components/TablePaginationButtons.jsx";
import DocumentTypesListTableFilter from "@/Pages/Admin/DocumentTypes/Components/DocumentTypesListTableFilter.jsx";
import DocumentTypeOperations from "@/Pages/Admin/DocumentTypes/Components/DocumentTypeOperations.jsx";

export default function DocumentTypesList({
    auth,
    paginate: { data, ...paginate },
}) {
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
                        },
                    ]}
                />
                <DashboardHeader heading="Manage Document Types">
                    <Button size="sm" asChild>
                        <Link href={route("admin.document-types.create")}>
                            <Icons.plus className="mr-2 h-4 w-4" />
                            Add Document Type
                        </Link>
                    </Button>
                </DashboardHeader>

                {/*Content*/}
                <div className="flex flex-col gap-4 p-2">
                    {/*Table Filters*/}
                    <DocumentTypesListTableFilter />

                    {/*Table Data*/}
                    <DocumentTypesTable documentTypes={data} />

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

function DocumentTypesTable({ documentTypes }) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-secondary">
                    <TableHead>Abbreviation</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date Created</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {documentTypes.map((dt, idx) => (
                    <TableRow key={idx}>
                        <TableCell>{dt.abbreviation}</TableCell>
                        <TableCell>{dt.name}</TableCell>
                        <TableCell>{dt.description}</TableCell>
                        <TableCell>
                            {dt?.created_at &&
                                dayjs(dt.created_at).format("MMM D YYYY")}
                        </TableCell>
                        <TableCell>
                            <DocumentTypeOperations dt={dt} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
