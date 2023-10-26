import { Head, Link, usePage } from "@inertiajs/react";
import DashboardHeader from "@/Components/DashboardHeader.jsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import Breadcrumb from "@/Components/Breadcrumb.jsx";
import { Button } from "@/Components/ui/button.jsx";
import Icons from "@/Components/Icons.jsx";
import { ucwords } from "@/lib/utils.js";
import dayjs from "dayjs";

export default function ViewDocument({
    auth,
    withActionButtons = false,
    withDocumentHistories = false,
    document,
}) {
    // console.log(withDocumentHistories, withActionButtons);
    console.log(document);
    return (
        <AuthenticatedLayout user={auth.user} withSidebar={false}>
            <Head title="Pending Documents" />
            <div className="flex flex-col items-start gap-8">
                <Button
                    variant="ghost"
                    className="space-x-2"
                    onClick={() => history.back()}
                >
                    <Icons.chevronLeft className="h-4 w-4" />
                    <span>Back</span>
                </Button>
                <DashboardHeader heading="Document Details" />
                <div className="px-2">
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-bold">
                                    Tracking Code
                                </TableCell>
                                <TableCell>{document.tracking_code}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold">
                                    Title
                                </TableCell>
                                <TableCell>{document.title}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold">
                                    Document Type
                                </TableCell>
                                <TableCell>
                                    {document.document_type.name}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold">
                                    Purposes
                                </TableCell>
                                <TableCell className="space-x-2">
                                    {document.purpose.map((purpose, index) => (
                                        <span key={index}>
                                            {ucwords(purpose) + ", "}
                                        </span>
                                    ))}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold">
                                    Description
                                </TableCell>
                                <TableCell>
                                    {document.description
                                        ? document.description
                                        : "No Description"}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold">
                                    Date Created
                                </TableCell>
                                <TableCell>
                                    <div>
                                        {dayjs(document.created_at).format(
                                            "MMMM DD, YYYY",
                                        )}
                                    </div>
                                    <div>
                                        {dayjs(document.created_at).format(
                                            "hh:mm A",
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
