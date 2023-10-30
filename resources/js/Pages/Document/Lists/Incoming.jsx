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

export default function Incoming({ auth, documentTransfers }) {
    console.log(documentTransfers);
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Incoming" />
            <div className="grid items-start gap-8">
                <DashboardHeader
                    heading="Incoming Documents"
                    text="Documents released by other offices."
                />
                <div className="px-2">
                    {documentTransfers.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-secondary">
                                    <TableHead>Title</TableHead>
                                    <TableHead>Sender</TableHead>
                                    <TableHead>Date Released</TableHead>
                                    <TableHead>Purpose</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                                {documentTransfers.map((dt, index) => {
                                    const purposes = JSON.parse(dt.purpose);

                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{dt.title}</TableCell>
                                            <TableCell>
                                                {dt.sender_name}
                                            </TableCell>
                                            <TableCell>
                                                {dayjs(dt.date_released).format(
                                                    "MMMM DD, YY h:mm a",
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {purposes.map(
                                                    (purpose, index) => (
                                                        <div
                                                            className="text-sm capitalize"
                                                            key={index}
                                                        >
                                                            {purpose}
                                                        </div>
                                                    ),
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
                            </TableHeader>
                            <TableBody></TableBody>
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
