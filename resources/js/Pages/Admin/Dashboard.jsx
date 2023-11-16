import AdminLayout from "@/Layouts/AdminLayout.jsx";
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
import DocumentOperations from "@/Pages/Admin/Documents/Components/DocumentOperations.jsx";

export default function Dashboard({ auth, counts, latestDocuments }) {
    return (
        <AdminLayout user={auth.user}>
            <Head title="Dashboard" />
            <div className="flex flex-col justify-start gap-8">
                <DashboardHeader heading="Dashboard" />
                <div className="space-y-6">
                    <div className="flex flex-wrap gap-4">
                        <div className="min-w-fit max-w-sm flex-1 rounded-xl border p-4 text-center">
                            <h4 className="text-xl font-semibold text-gray-700">
                                Documents
                            </h4>
                            {/*    display the total count of owned documents*/}
                            <div className="text-4xl font-semibold text-gray-700">
                                {counts.documents}
                            </div>
                        </div>

                        <div className="min-w-fit max-w-sm flex-1 rounded-xl border p-4 text-center">
                            <h4 className="text-xl font-semibold text-gray-700">
                                Users
                            </h4>
                            {/*    display the total count of owned documents*/}
                            <div className="text-4xl font-semibold text-gray-700">
                                {counts.users}
                            </div>
                        </div>

                        <div className="w-full rounded border">
                            <div className="flex items-center justify-between border-b bg-secondary">
                                <h4 className="p-4 text-xl font-semibold text-gray-700">
                                    Recently created documents
                                </h4>
                                <Button variant="link">
                                    <Link href={route("admin.documents.index")}>
                                        View all
                                    </Link>
                                </Button>
                            </div>
                            <div className="mt-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Document</TableHead>
                                            <TableHead>Owner</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Date Created</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {latestDocuments.map(
                                            (document, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>
                                                        <div className="font-bold">
                                                            {
                                                                document.tracking_code
                                                            }
                                                        </div>
                                                        <div>
                                                            {document.title}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {document.owner.name}
                                                    </TableCell>
                                                    <TableCell className="capitalize">
                                                        {document.type.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {document?.created_at &&
                                                            dayjs(
                                                                document.created_at,
                                                            ).format(
                                                                "MMM DD YYYY",
                                                            )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <DocumentOperations
                                                            document={document}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
