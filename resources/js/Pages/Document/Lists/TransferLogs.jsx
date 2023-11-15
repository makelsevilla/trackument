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
import TransfersListTableFilter from "@/Pages/Document/Lists/Components/TransfersListsTableFilter.jsx";
import React, { useEffect } from "react";
import { Badge } from "@/Components/ui/badge.jsx";
import { transferStatuses } from "@/config/badgesColorMap.js";

export default function TransferLogs({
    auth,
    paginatedTransfers: { data: transfers, ...paginate },
    filters,
}) {
    useEffect(() => {
        Echo.private(`transfer.${auth.user.id}`).listen(
            "DocumentTransferEvent",
            (e) => {
                router.reload({ only: ["paginatedTransfers"] });
            },
        );

        return () => {
            Echo.leaveChannel(`transfer.${auth.user.id}`);
        };
    }, []);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Transfer Logs" />
            <div className="flex flex-col justify-start gap-8">
                <Breadcrumb
                    items={[
                        {
                            label: "Home",
                            href: route("dashboard"),
                        },
                        {
                            label: "Transfer Logs",
                        },
                    ]}
                />
                <DashboardHeader
                    heading="Transfer Logs"
                    text="Generate the results of your filtered query by clicking the Generate Report button."
                >
                    <Button asChild>
                        <a
                            target="_blank"
                            href={route("documents.lists.transfers", {
                                ...filters,
                                report: true,
                            })}
                        >
                            Generate Report
                        </a>
                    </Button>
                </DashboardHeader>

                {/*Content*/}
                <div className="flex flex-col gap-4 p-2">
                    {/*Table Filter*/}
                    <TransfersListTableFilter />

                    {/*Data Table*/}
                    <TransfersTable transfers={transfers} />

                    <div>
                        {transfers.length === 0 && (
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

function TransfersTable({ transfers }) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-secondary">
                    <TableHead>Document Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Transferred</TableHead>
                    <TableHead>Date Completed</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Receiver</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transfers.map((transfer, idx) => (
                    <TableRow key={idx}>
                        <TableCell>
                            {transfer?.document?.tracking_code}
                        </TableCell>
                        <TableCell>
                            <Badge
                                className="capitalize"
                                variant={transferStatuses[transfer.status]}
                            >
                                {transfer.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            {transfer?.transferred_at &&
                                dayjs(transfer.transferred_at).format(
                                    "MMM DD YYYY hh:mm A",
                                )}
                        </TableCell>
                        <TableCell>
                            {transfer?.completed_at
                                ? dayjs(transfer.completed_at).format(
                                      "MMM DD YYYY hh:mm A",
                                  )
                                : "N/A"}
                        </TableCell>
                        <TableCell>{transfer?.sender?.name}</TableCell>
                        <TableCell>
                            {transfer?.receiver?.name ||
                                transfer?.receiver_name}
                        </TableCell>
                        <TableCell>
                            <Button variant="ghost" size="icon" asChild>
                                <Link
                                    href={route(
                                        "documents.transfer.show",
                                        transfer.id,
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
    );
}
