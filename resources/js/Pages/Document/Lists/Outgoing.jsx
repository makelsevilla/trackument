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

export default function Outgoing({ auth, documentTransfers }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Outgoing" />
            <div className="grid items-start gap-8">
                <DashboardHeader
                    heading="Outgoing Documents"
                    text="Documents released from your office."
                />
                <div className="px-2">
                    {documentTransfers.length > 0 ? (
                        <Table>
                            <TableHeader className="bg-secondary">
                                <TableRow>
                                    <TableHead>Tracking Code</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Receiver</TableHead>
                                    <TableHead>Date Released</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documentTransfers.map((dt, index) => {
                                    return (
                                        <TableRow>
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
                    ) : (
                        <div className="flex justify-center border-t py-4 text-muted-foreground">
                            No Documents
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
