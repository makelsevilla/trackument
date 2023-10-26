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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover.jsx";

export default function ViewDocument({
    auth,
    isOwner = false,
    isCurrentOwner = false,
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
                {/*Document actions*/}

                <div className="flex w-full">
                    {isCurrentOwner && (
                        <div className="space-x-2">
                            <Button variant="outline">
                                <Icons.terminal className="h-4 w-4" />
                                <span className="ml-2">Tag as Terminal</span>
                            </Button>
                            <Button variant="outline">
                                <Icons.forward className="h-4 w-4" />
                                <span className="ml-2">Release</span>
                            </Button>
                        </div>
                    )}
                    <Button className="ml-auto" variant="outline">
                        <Icons.printer className="h-4 w-4" />
                        <span className="ml-2">Print Tracking Slip</span>
                    </Button>
                </div>
                <DashboardHeader heading="Document Details" />
                <div className="w-full px-2">
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
                                <TableCell className="flex items-center gap-4">
                                    {document.document_type.name}

                                    <Popover>
                                        <PopoverTrigger>
                                            <Icons.helpCircle className="h-4 w-4" />
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            {document.document_type.description}
                                        </PopoverContent>
                                    </Popover>
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
                            <TableRow>
                                <TableCell className="font-bold">
                                    Owner
                                </TableCell>
                                <TableCell>{document.owner.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold">
                                    Current Owner
                                </TableCell>
                                <TableCell>
                                    {document.current_owner.name}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
