import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, Link, router } from "@inertiajs/react";
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
import Breadcrumb from "@/Components/Breadcrumb.jsx";
import TablePaginationButtons from "@/Components/TablePaginationButtons.jsx";
import OutgoingTableFilter from "@/Pages/Document/Lists/Components/OutgoingTableFilter.jsx";
import { useEffect } from "react";

export default function Outgoing({
    auth,
    paginatedDocumentTransfers: { data: transfers, ...paginate },
    filters,
}) {
    useEffect(() => {
        Echo.private(`transfer.${auth.user.id}`).listen(
            "UserTransferEvent",
            (e) => {
                router.reload();
            },
        );

        return () => {
            Echo.leaveChannel(`transfer.${auth.user.id}`);
        };
    }, []);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Outgoing" />
            <div className="flex flex-col justify-start gap-8">
                <Breadcrumb
                    items={[
                        {
                            label: "Home",
                            href: route("dashboard"),
                        },
                        {
                            label: "Outgoing",
                        },
                    ]}
                />
                <DashboardHeader
                    heading="Outgoing Documents"
                    text="Documents released from your office."
                />
                <div className="flex flex-col gap-4 p-2">
                    {/*Table Filter*/}
                    <OutgoingTableFilter />

                    {/*Data Table*/}
                    <OutgoingTable transfers={transfers} />

                    {/*Table Footer*/}
                    <div>
                        {transfers.length === 0 && (
                            <div className="text-center text-muted-foreground">
                                No Data Found
                            </div>
                        )}
                    </div>

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

function OutgoingTable({ transfers }) {
    return (
        <Table>
            <TableHeader className="bg-secondary">
                <TableRow>
                    <TableHead>Tracking Code</TableHead>
                    <TableHead>Document Title</TableHead>
                    <TableHead>Receiver</TableHead>
                    <TableHead>Date Released</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transfers.map((transfer, index) => {
                    return (
                        <TableRow key={index}>
                            <TableCell>
                                {transfer.document.tracking_code}
                            </TableCell>
                            <TableCell>{transfer.document.title}</TableCell>
                            <TableCell>
                                {transfer?.receiver?.name || "Uknown"}
                            </TableCell>
                            <TableCell>
                                {dayjs(transfer.date_released).format(
                                    "MMM DD, YYYY h:mm a",
                                )}
                            </TableCell>
                            <TableCell>
                                <Button size="icon" variant="link" asChild>
                                    <Link
                                        href={route("documents.transfer.show", {
                                            documentTransferId: transfer.id,
                                        })}
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
    );
}
