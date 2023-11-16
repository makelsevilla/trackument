import Breadcrumb from "@/Components/Breadcrumb.jsx";
import DashboardHeader from "@/Components/DashboardHeader.jsx";

import AdminLayout from "@/Layouts/AdminLayout.jsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table.jsx";
import dayjs from "dayjs";

import TablePaginationButtons from "@/Components/TablePaginationButtons.jsx";
import DocumentOperations from "@/Pages/Admin/Documents/Components/DocumentOperations.jsx";
import DocumentsListTableFilter from "@/Pages/Admin/Documents/Components/DocumentsListTableFilter.jsx";

export default function DocumentsList({
    auth,
    paginatedDocuments: { data: documents, ...paginate },
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
                            label: "Documents",
                        },
                    ]}
                />
                <DashboardHeader heading="Manage Documents" />

                {/*Content*/}
                <div className="flex flex-col gap-4 p-2">
                    {/*Table Filter*/}
                    <DocumentsListTableFilter />
                    {/*Table Data*/}
                    <DocumentsTable documents={documents} />
                    <div>
                        {documents.length === 0 && (
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

function DocumentsTable({ documents }) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-secondary">
                    <TableHead>Document</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-20">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {documents.map((document, idx) => (
                    <TableRow key={idx}>
                        <TableCell>
                            <div className="font-bold">
                                {document.tracking_code}
                            </div>
                            <div>{document.title}</div>
                        </TableCell>
                        <TableCell>{document.owner.name}</TableCell>
                        <TableCell className="capitalize">
                            {document.type.name}
                        </TableCell>
                        <TableCell>
                            {document?.created_at &&
                                dayjs(document.created_at).format(
                                    "MMM DD YYYY",
                                )}
                        </TableCell>
                        <TableCell>
                            <DocumentOperations document={document} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
