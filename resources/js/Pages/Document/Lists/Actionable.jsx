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

export default function Actionable({ auth, documents }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Pending Documents" />
            <div className="grid items-start gap-8">
                <DashboardHeader
                    heading="Actionable"
                    text="Take actions to received documents."
                />
                <div className="px-2">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-t">
                                <TableHead>Title</TableHead>
                                <TableHead>Tracking Code</TableHead>
                                <TableHead>Sender</TableHead>
                                <TableHead>Date Received</TableHead>
                            </TableRow>
                            {documents.map((document, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Link
                                            href={`/documents/${document.id}`}
                                        >
                                            {document.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {document.tracking_code}
                                    </TableCell>
                                    <TableCell>
                                        {document.previous_owner_name}
                                    </TableCell>
                                    <TableCell>
                                        {dayjs(document.date_received).format(
                                            "h:mm a MMMM DD, YYYY",
                                        )}
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
