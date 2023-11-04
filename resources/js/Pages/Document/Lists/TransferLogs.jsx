import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, Link } from "@inertiajs/react";
import DashboardHeader from "@/Components/DashboardHeader.jsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table.jsx";
import dayjs from "dayjs";
import { Button } from "@/Components/ui/button.jsx";
import Icons from "@/Components/Icons.jsx";
import { Badge } from "@/Components/ui/badge.jsx";
import PaginationButtons from "@/Pages/Document/Lists/Components/PaginationButtons.jsx";
import TableFilter from "@/Pages/Document/Lists/Components/TableFilter.jsx";
import { transferLogCategories } from "@/Pages/Document/Lists/Components/pageFilterCategories.js";

export default function TransferLogs({
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
                    heading="Transfer Logs"
                    text="Released and received documents."
                />
                <div className="px-2">
                    {/*Table Filter*/}
                    <TableFilter
                        filters={filters}
                        categories={transferLogCategories}
                        url={route("documents.lists.transfers")}
                    />

                    {/*Data Table*/}
                    <Table>
                        <TableHeader className="bg-secondary">
                            <TableRow>
                                <TableHead>Document</TableHead>
                                <TableHead>Sender</TableHead>
                                <TableHead>Receiver</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date Completed</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documentTransfers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan="5">
                                        <div className="flex items-center justify-center space-x-2">
                                            <span className="py-8 font-medium text-gray-500">
                                                No transfer logs.
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                            {documentTransfers.map((dt, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className="text-sm text-muted-foreground">
                                            {dt.document_tracking_code}
                                        </div>
                                        <div className="font-medium">
                                            {dt.document_title}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-bold">
                                        {dt.sender_name}
                                    </TableCell>
                                    <TableCell className="font-bold">
                                        {dt.receiver_name}
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        {dt.status}
                                    </TableCell>
                                    <TableCell className="space-y-2">
                                        <div>
                                            {dt?.date_completed && (
                                                <div>
                                                    {dayjs(
                                                        dt.date_received,
                                                    ).format(
                                                        "MMM D, YYYY h:mm a",
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                        >
                                            <Link
                                                href={route(
                                                    "documents.transfer.show",
                                                    dt.id,
                                                )}
                                            >
                                                <Icons.view className="h-5 w-5" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/*Pagination*/}
                    {paginatedDocumentTransfers.last_page > 1 && (
                        <div className="flex justify-end pt-4">
                            <PaginationButtons
                                next_page_url={
                                    paginatedDocumentTransfers.next_page_url
                                }
                                prev_page_url={
                                    paginatedDocumentTransfers.prev_page_url
                                }
                            />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
