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
import TransfersListTableFilter from "@/Pages/Admin/Transfers/Component/TransfersListTableFilter.jsx";
import { Button } from "@/Components/ui/button.jsx";
import { Link } from "@inertiajs/react";

export default function TransfersList({
    auth,
    paginatedTransfers: { data: transfers, ...paginate },
    filters,
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
                            label: "Transfers",
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
                            href={route("admin.document-transfers.index", {
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

                    {/*Table Data*/}
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
        </AdminLayout>
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
                </TableRow>
            </TableHeader>
            <TableBody>
                {transfers.map((transfer, idx) => (
                    <TableRow key={idx}>
                        <TableCell>
                            {transfer?.document?.tracking_code}
                        </TableCell>
                        <TableCell>{transfer.status}</TableCell>
                        <TableCell>
                            {transfer?.transferred_at &&
                                dayjs(transfer.transferred_at).format(
                                    "MMM DD YYYY hh:mm A",
                                )}
                        </TableCell>
                        <TableCell>
                            {transfer?.completed_at
                                ? dayjs(transfer.transferred_at).format(
                                      "MMM DD YYYY hh:mm A",
                                  )
                                : "N/A"}
                        </TableCell>
                        <TableCell>{transfer?.sender?.name}</TableCell>
                        <TableCell>{transfer?.receiver?.name}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
