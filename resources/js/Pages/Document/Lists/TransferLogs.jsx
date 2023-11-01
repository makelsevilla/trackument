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

export default function TransferLogs({ auth, documentTransfers }) {
    console.log(documentTransfers);
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Incoming" />
            <div className="grid items-start gap-8">
                <DashboardHeader
                    heading="Document Transfer Logs"
                    text="Released and received documents."
                />
                <div className="px-2">
                    {documentTransfers.length > 0 ? (
                        <Table>
                            <TableHeader className="bg-secondary">
                                <TableRow>
                                    <TableHead>Document</TableHead>
                                    <TableHead>Sender</TableHead>
                                    <TableHead>Receiver</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Dates</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documentTransfers.map((dt, index) => (
                                    <TableRow>
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
                                                <p className="text-sm text-muted-foreground">
                                                    Released
                                                </p>
                                                {dt?.date_released && (
                                                    <div>
                                                        {dayjs(
                                                            dt.date_released,
                                                        ).format(
                                                            "h:mm a MMM D, YYYY",
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    Completed
                                                </p>
                                                {dt?.date_completed && (
                                                    <div>
                                                        {dayjs(
                                                            dt.date_received,
                                                        ).format(
                                                            "h:mm a MMM D, YYYY",
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
                    ) : (
                        <div className="flex justify-center border-t py-4 text-muted-foreground">
                            No Records.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
