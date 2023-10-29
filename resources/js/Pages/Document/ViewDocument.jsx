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
import { Badge } from "@/Components/ui/badge.jsx";
import { Separator } from "@/Components/ui/separator.jsx";

export default function ViewDocument({
    auth,
    document,
    withActionButtons = false,
    withFiles = false,
    documentTransfer,
}) {
    console.log(document);
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Pending Documents" />
            <div className="flex flex-col items-start gap-8">
                <Breadcrumb
                    items={[
                        { label: "Home", href: route("dashboard") },
                        {
                            label: "Documents",
                            href: route("documents.lists.actionable"),
                        },
                        {
                            label: document.tracking_code,
                        },
                    ]}
                />
                {/*Document actions*/}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => history.back()}
                >
                    <Icons.chevronLeft className="h-4 w-4" />
                    <span className="ml-2">Back</span>
                </Button>
                <div className="flex w-full">
                    {withActionButtons && (
                        <div className="space-x-2">
                            {document.status &&
                            document.status === "terminal" ? (
                                <Button variant="outline" asChild>
                                    <Link
                                        size="sm"
                                        as="button"
                                        method="post"
                                        href={route("documents.unlock", {
                                            document: document.id,
                                        })}
                                    >
                                        <Icons.unlock className="h-4 w-4" />
                                        <span className="ml-2">Unlock</span>
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button size="sm" variant="outline" asChild>
                                        <Link
                                            as="button"
                                            method="post"
                                            href={route("documents.terminate", {
                                                document: document.id,
                                            })}
                                        >
                                            <Icons.terminal className="h-4 w-4" />
                                            <span className="ml-2">
                                                Tag as Terminal
                                            </span>
                                        </Link>
                                    </Button>
                                    <Button size="sm" variant="outline" asChild>
                                        <Link
                                            href={route("documents.release", {
                                                document: document.id,
                                            })}
                                        >
                                            <Icons.forward className="h-4 w-4" />
                                            <span className="ml-2">
                                                Release
                                            </span>
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                    {documentTransfer && (
                        <Button className="ml-8" size="sm" variant="link">
                            <Link
                                href={route("documents.transfer.show", {
                                    documentTransferId: documentTransfer.id,
                                })}
                            >
                                See Transfer Detail
                            </Link>
                        </Button>
                    )}
                    <Button size="sm" className="ml-auto" variant="outline">
                        <Icons.printer className="h-4 w-4" />
                        <span className="ml-2">Tracking Slip</span>
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
                            <TableRow>
                                <TableCell className="font-bold">
                                    Related Documents
                                </TableCell>
                                <TableCell>
                                    {document?.related_documents.length > 0 ? (
                                        <>
                                            {document.related_documents.map(
                                                (related, index) => (
                                                    <Badge
                                                        variant="outline"
                                                        key={index}
                                                    >
                                                        {
                                                            related.related_document_code
                                                        }
                                                    </Badge>
                                                ),
                                            )}
                                        </>
                                    ) : (
                                        <>No related documents</>
                                    )}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold">
                                    Status
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {document.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    {withFiles && (
                        <>
                            <Separator className="my-8" />
                            <DashboardHeader heading="Files" />
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
