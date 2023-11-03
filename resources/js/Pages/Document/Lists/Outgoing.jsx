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
import TableFilter from "@/Pages/Document/Lists/Components/TableFilter.jsx";
import { outgoingCategories } from "@/Pages/Document/Lists/Components/pageFilterCategories.js";
import PaginationButtons from "@/Pages/Document/Lists/Components/PaginationButtons.jsx";

export default function Outgoing({
    auth,
    paginatedDocumentTransfers,
    filters,
}) {
    const { data: documentTransfers } = paginatedDocumentTransfers;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Outgoing" />
            <div className="grid items-start gap-8">
                <DashboardHeader
                    heading="Outgoing Documents"
                    text="Documents released from your office."
                />
                <div className="px-2">
                    {/*Table Filter*/}
                    <TableFilter
                        categories={outgoingCategories}
                        filters={filters}
                        url={route("documents.lists.outgoing")}
                    />

                    {/*Data Table*/}
                    <Table>
                        <TableHeader className="bg-secondary">
                            <TableRow>
                                <TableHead>Tracking Code</TableHead>
                                <TableHead>Document Title</TableHead>
                                <TableHead>Sent to</TableHead>
                                <TableHead>Date Released</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documentTransfers.map((dt, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell>
                                            {dt.tracking_code}
                                        </TableCell>
                                        <TableCell>{dt.title}</TableCell>
                                        <TableCell>
                                            {dt.receiver_name}
                                        </TableCell>
                                        <TableCell>
                                            {dayjs(dt.date_released).format(
                                                "h:mm a | MMM DD, YYYY",
                                            )}
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
