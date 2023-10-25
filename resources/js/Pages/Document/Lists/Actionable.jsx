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
                                <TableHead>Previous Owner</TableHead>
                                <TableHead>Date Received</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody></TableBody>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
