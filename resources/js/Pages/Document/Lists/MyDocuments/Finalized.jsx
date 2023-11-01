import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
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

export default function Finalized({ auth, documents }) {
    // console.log(documents);
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Finalized Documents" />
            <div className="grid items-start gap-8">
                <DashboardHeader
                    heading="My Documents"
                    text="Finalized documents."
                >
                    <Button asChild>
                        <Link
                            href={route("documents.store")}
                            method="post"
                            as="button"
                        >
                            New Document
                        </Link>
                    </Button>
                </DashboardHeader>
                <div className="px-2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tracking Code</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Document Type</TableHead>
                                <TableHead>Current Owner</TableHead>
                                <TableHead>Date Created</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents &&
                                documents.map((document, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {document.tracking_code}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {document.title}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {document.document_type_name}
                                            </TableCell>
                                            <TableCell>
                                                {document.current_owner_name}
                                            </TableCell>
                                            <TableCell>
                                                {dayjs(
                                                    document.created_at,
                                                ).format("MMMM DD, YYYY")}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    asChild
                                                >
                                                    <Link
                                                        href={route(
                                                            "documents.show",
                                                            {
                                                                document:
                                                                    document.id,
                                                            },
                                                        )}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <Icons.view className="h-4 w-4" />
                                                        <span>View</span>
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
