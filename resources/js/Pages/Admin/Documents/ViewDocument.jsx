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
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/Components/ui/dialog.jsx";
import TrackingSlip from "@/Components/TrackingSlip.jsx";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible.jsx";
import { Label } from "@/Components/ui/label.jsx";
import DocumentFileCard from "@/Components/DocumentFileCard.jsx";
import AdminLayout from "@/Layouts/AdminLayout.jsx";

export default function ViewDocument({ auth, document, documentFiles }) {
    const backupFiles = documentFiles.filter((file) => file.role === "backup");
    const attachmentFiles = documentFiles.filter(
        (file) => file.role === "attachment",
    );

    return (
        <AdminLayout user={auth.user}>
            <div className="flex flex-col justify-start gap-8">
                <Breadcrumb
                    items={[
                        {
                            label: "Home",
                            href: route("admin.dashboard"),
                        },
                        {
                            label: "Documents",
                            href: route("admin.documents.index"),
                        },
                        {
                            label: document.tracking_code,
                        },
                    ]}
                />
                <DashboardHeader heading="Document Details">
                    <Button size="sm" asChild>
                        <Link
                            href={route("admin.documents.edit", {
                                document: document.id,
                            })}
                        >
                            <Icons.edit className="mr-2 h-4 w-4" />
                            Edit Document
                        </Link>
                    </Button>
                </DashboardHeader>

                {/*Content*/}
                <div className="flex flex-col gap-4 p-2">
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
                                    {document.type.name}

                                    <Popover>
                                        <PopoverTrigger>
                                            <Icons.helpCircle className="h-4 w-4" />
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            {document.type.description}
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

                    {/*Document Files*/}
                    <div className="mt-8">
                        <div className="text-xl font-medium">
                            Document Files
                        </div>
                        <div className="mt-4 space-y-4">
                            <div>
                                <Collapsible>
                                    <div className="flex items-center gap-4">
                                        <p>Backup Files</p>
                                        <CollapsibleTrigger asChild>
                                            <Button size="icon" variant="ghost">
                                                <Icons.chevronsUpDown className="h-4 w-4" />
                                            </Button>
                                        </CollapsibleTrigger>
                                    </div>
                                    <CollapsibleContent className="space-y-2">
                                        {backupFiles.length > 0 ? (
                                            backupFiles.map((file, index) => (
                                                <DocumentFileCard
                                                    file={file}
                                                    key={index}
                                                />
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground">
                                                No files.
                                            </p>
                                        )}
                                    </CollapsibleContent>
                                </Collapsible>
                            </div>
                            <div>
                                <Collapsible>
                                    <div className="flex items-center gap-4">
                                        <p>Attachment Files</p>
                                        <CollapsibleTrigger asChild>
                                            <Button size="icon" variant="ghost">
                                                <Icons.chevronsUpDown className="h-4 w-4" />
                                            </Button>
                                        </CollapsibleTrigger>
                                    </div>
                                    <CollapsibleContent className="space-y-2">
                                        {attachmentFiles.length > 0 ? (
                                            attachmentFiles.map(
                                                (file, index) => (
                                                    <DocumentFileCard
                                                        file={file}
                                                        key={index}
                                                    />
                                                ),
                                            )
                                        ) : (
                                            <p className="text-muted-foreground">
                                                No files.
                                            </p>
                                        )}
                                    </CollapsibleContent>
                                </Collapsible>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
