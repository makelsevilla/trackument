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

export default function Actionable({ auth, paginatedDocuments, filters }) {
    const documents = paginatedDocuments.data;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Pending Documents" />
            <div className="grid items-start gap-8">
                <DashboardHeader
                    heading="Actionable"
                    text="Take actions to received documents."
                />
                <div className="px-2">
                    {/*Table Filter*/}
                    <ActionableTableFilter filters={filters} />

                    {/*Data Table*/}
                    <Table>
                        <TableHeader className="bg-secondary">
                            <TableRow className="border-t">
                                <TableHead>Title</TableHead>
                                <TableHead>Tracking Code</TableHead>
                                <TableHead>Sender</TableHead>
                                <TableHead>Date Received</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {documents.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan="5">
                                        <div className="flex items-center justify-center space-x-2">
                                            <span className="text-gray-500">
                                                No documents found.
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                            {documents.map((document, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Link
                                            href={`/documents/${document.id}`}
                                        >
                                            {document.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {document.tracking_code}
                                    </TableCell>
                                    <TableCell>
                                        {document.previous_owner_name}
                                    </TableCell>
                                    <TableCell>
                                        {dayjs(document.date_received).format(
                                            "h:mm a MMMM DD, YYYY",
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="icon"
                                        >
                                            <Link
                                                href={route(
                                                    "documents.transfer.show",
                                                    document.document_transfer_id,
                                                )}
                                            >
                                                <Icons.view className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/*Pagination*/}
                    {paginatedDocuments.last_page > 1 && (
                        <div className="flex justify-end pt-4">
                            <PaginationButtons
                                next_page_url={paginatedDocuments.next_page_url}
                                prev_page_url={paginatedDocuments.prev_page_url}
                            />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
