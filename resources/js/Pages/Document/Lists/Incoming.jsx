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
                    text="Incoming documents coming from other offices."
                />
                <div className="px-2">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-t">
                                <TableHead>Title</TableHead>
                                <TableHead>Sender</TableHead>
                                <TableHead>Date Released</TableHead>
                                <TableHead>Purpose</TableHead>
                            </TableRow>
                            {documentTransfers.map((dt, index) => (
                                <TableRow key={index}>
                                    <TableCell>{dt.title}</TableCell>
                                    <TableCell>{dt.sender_name}</TableCell>
                                    <TableCell>
                                        {dayjs(dt.date_released).format(
                                            "MMMM DD, YY h:mm a",
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {dt.purposes.map((purpose, index) => (
                                            <div
                                                className="text-sm text-muted-foreground"
                                                key={index}
                                            >
                                                {purpose}
                                            </div>
                                        ))}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody></TableBody>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
