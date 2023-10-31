import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head } from "@inertiajs/react";
import DashboardHeader from "@/Components/DashboardHeader.jsx";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table.jsx";

export default function TransferLogs({ auth, documentTransfers }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Incoming" />
            <div className="grid items-start gap-8">
                <DashboardHeader
                    heading="Incoming Documents"
                    text="Documents released by other offices."
                />
                <div className="px-2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Document Code</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody></TableBody>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
