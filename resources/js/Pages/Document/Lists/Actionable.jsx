import { Head, Link } from "@inertiajs/react";
import DashboardHeader from "@/Components/DashboardHeader.jsx";
import { Button } from "@/Components/ui/button.jsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table.jsx";
import dayjs from "dayjs";
import Icons from "@/Components/Icons.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import ActionableTableFilter from "@/Pages/Document/Lists/Components/ActionableTableFilter.jsx";
import PaginationButtons from "@/Pages/Document/Lists/Components/PaginationButtons.jsx";
import Breadcrumb from "@/Components/Breadcrumb.jsx";
import TablePaginationButtons from "@/Components/TablePaginationButtons.jsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu.jsx";

export default function Actionable({
    auth,
    paginatedDocuments: { data: documents, ...paginate },
    filters,
}) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Pending Documents" />
            <div className="flex flex-col justify-start gap-8">
                <Breadcrumb
                    items={[
                        {
                            label: "Home",
                            href: route("dashboard"),
                        },
                        {
                            label: "Pending for Action",
                        },
                    ]}
                />

                <DashboardHeader
                    heading="Actionable"
                    text="Take actions to received documents."
                />
                <div className="flex flex-col gap-4 p-2">
                    {/*Table Filter*/}
                    <ActionableTableFilter filters={filters} />

                    {/*Data Table*/}
                    <ActionableTable documents={documents} />

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
        </AuthenticatedLayout>
    );
}

function ActionableTable({ documents }) {
    return (
        <Table>
            <TableHeader className="bg-secondary">
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Tracking Code</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Date Received</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {documents.map((document, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            <Link href={`/documents/${document.id}`}>
                                {document.title}
                            </Link>
                        </TableCell>
                        <TableCell>{document.tracking_code}</TableCell>
                        <TableCell>{document.previous_owner_name}</TableCell>
                        <TableCell>
                            {document?.document_transfers_completed_at &&
                                dayjs(
                                    document?.document_transfers_completed_at,
                                ).format("MMMM DD, YYYY h:mm a")}
                        </TableCell>
                        <TableCell>
                            <div className="space-x-1">
                                <DocumentAction document={document} />
                                <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    asChild
                                >
                                    <Link
                                        href={route("documents.release", {
                                            document: document.id,
                                        })}
                                    >
                                        <Icons.forward className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function DocumentAction({ document }) {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <Icons.moreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link
                            href={route("documents.show", {
                                document: document.id,
                            })}
                        >
                            Document Details
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={route("documents.transfer.show", {
                                documentTransferId:
                                    document.document_transfers_id,
                            })}
                        >
                            Transfer Details
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
