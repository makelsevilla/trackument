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
import IncomingTableFilter from "@/Pages/Document/Lists/Components/IncomingTableFilter.jsx";
import PaginationButtons from "@/Pages/Document/Lists/Components/PaginationButtons.jsx";

export default function Incoming({
    auth,
    paginatedDocumentTransfers,
    filters,
}) {
    const documentTransfers = paginatedDocumentTransfers.data;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Incoming" />
            <div className="grid items-start gap-8">
                <DashboardHeader
                    heading="Incoming Documents"
                    text="Documents released by other offices."
                />
                <div className="px-2">
                    {/*Table Filters*/}
                    <IncomingTableFilter filters={filters} />

                    {/*Data Table*/}
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-secondary">
                                <TableHead>Title</TableHead>
                                <TableHead>Sender</TableHead>
                                <TableHead>Date Released</TableHead>
                                <TableHead>Purpose</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documentTransfers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan="5">
                                        <div className="flex items-center justify-center space-x-2">
                                            <span className="py-8 font-medium text-gray-500">
                                                No incoming documents.
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                            {documentTransfers.map((dt, index) => {
                                const purposes = JSON.parse(dt.purpose);

                                return (
                                    <TableRow key={index}>
                                        <TableCell>{dt.title}</TableCell>
                                        <TableCell>{dt.sender_name}</TableCell>
                                        <TableCell>
                                            {dayjs(dt.date_released).format(
                                                "MMMM DD, YY h:mm a",
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {purposes.map((purpose, index) => (
                                                <div
                                                    className="text-sm capitalize"
                                                    key={index}
                                                >
                                                    {purpose}
                                                </div>
                                            ))}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="icon"
                                                variant="link"
                                                asChild
                                            >
                                                <Link
                                                    href={route(
                                                        "documents.transfer.show",
                                                        {
                                                            documentTransferId:
                                                                dt.id,
                                                        },
                                                    )}
                                                >
                                                    <Icons.view className="h-5 w-5" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {/*Pagination*/}
                    {paginatedDocumentTransfers.last_page > 1 && (
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
