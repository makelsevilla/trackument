import { Head, Link, router } from "@inertiajs/react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Button } from "@/Components/ui/button.jsx";
import Icons from "@/Components/Icons.jsx";
import { ucwords } from "@/lib/utils.js";
import dayjs from "dayjs";
import { Badge } from "@/Components/ui/badge.jsx";
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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card.jsx";
import { Checkbox } from "@/Components/ui/checkbox.jsx";
import { useEffect } from "react";
import { documentStatuses } from "@/config/badgesColorMap.js";

export default function ViewDocument({
    auth,
    document,
    withActionButtons = false,
    documentTransfer,
    documentFiles,
}) {
    const backupFiles = documentFiles.filter((file) => file.role === "backup");
    const attachmentFiles = documentFiles.filter(
        (file) => file.role === "attachment",
    );

    useEffect(() => {
        Echo.private(`transfer.${auth.user.id}`).listen(
            "DocumentTransferEvent",
            (e) => {
                router.reload({ preserveState: false });
            },
        );

        return () => {
            Echo.leaveChannel(`transfer.${auth.user.id}`);
        };
    }, []);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Pending Documents" />
            <div className="flex flex-col justify-start gap-8">
                {/*Document actions*/}
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
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                size="sm"
                                className="ml-auto"
                                variant="outline"
                            >
                                <Icons.printer className="h-4 w-4" />
                                <span className="ml-2">Tracking Slip</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <TrackingSlip
                                trackingCode={document.tracking_code}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="px-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Document Details</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-6">
                            <div className="grid gap-1.5 border-l-2 px-2">
                                <Label>Tracking Code:</Label>
                                <p className="capitalize">
                                    {document.tracking_code}
                                </p>
                            </div>
                            <div className="grid gap-1.5 border-l-2 px-2">
                                <Label>Owner:</Label>
                                <p className="capitalize">
                                    {document.owner.name}
                                </p>
                            </div>
                            <div className="grid gap-1.5 border-l-2 px-2">
                                <Label>Current Owner:</Label>
                                <p className="capitalize">
                                    {document.current_owner.name}
                                </p>
                            </div>
                            <div className="grid gap-1.5 border-l-2 px-2">
                                <Label>Document Type:</Label>
                                <p className="capitalize">
                                    {document.document_type.name}
                                </p>
                            </div>
                            <div className="grid gap-1.5 border-l-2 px-2">
                                <Label>Date Created:</Label>
                                <p className="capitalize">
                                    {dayjs(document.created_at).format(
                                        "MMMM DD, YYYY",
                                    )}
                                </p>
                            </div>
                            <div className="grid gap-1.5 border-l-2 px-2">
                                <Label>Status:</Label>
                                <Badge
                                    className="capitalize"
                                    variant={documentStatuses[document.status]}
                                >
                                    {document.status}
                                </Badge>
                            </div>
                            <div className="grid w-full gap-1.5 border-l-2 px-2">
                                <Label>Title:</Label>
                                <p className="capitalize">{document.title}</p>
                            </div>
                            <div className="grid w-full gap-1.5 border-l-2 px-2">
                                <Label>Purposes:</Label>
                                <p>
                                    {document.purpose.map((purpose, index) => (
                                        <span key={index}>
                                            {ucwords(purpose) + ", "}
                                        </span>
                                    ))}
                                </p>
                            </div>
                            <div className="grid w-full gap-1.5 border-l-2 px-2">
                                <Label>Description:</Label>
                                <p className="capitalize">
                                    {document.description
                                        ? document.description
                                        : "No Description Provided"}
                                </p>
                            </div>
                            <div className="grid w-full gap-1.5 border-l-2 px-2">
                                <Label>Related Documents:</Label>
                                <div className="gap-4 capitalize">
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
                                </div>
                            </div>
                            {document.owner_id === auth.user.id && (
                                <div className="grid w-full gap-1.5 border-l-2 px-2">
                                    <Label>Notifications</Label>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={document.notify_owner}
                                            onCheckedChange={(checked) => {
                                                router.put(
                                                    route(
                                                        "documents.updateNotifyOwner",
                                                        {
                                                            document:
                                                                document.id,
                                                        },
                                                    ),
                                                    { notify_owner: checked },
                                                );
                                            }}
                                            id="notify_owner"
                                        />
                                        <label htmlFor="notify_owner">
                                            Receive notifications whenever
                                            someone processes this document.
                                        </label>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/*Document Files*/}
                    <div className="mt-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Document Files</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <Collapsible>
                                        <div className="flex items-center gap-4">
                                            <p>Backup Files</p>
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                >
                                                    <Icons.chevronsUpDown className="h-4 w-4" />
                                                </Button>
                                            </CollapsibleTrigger>
                                        </div>
                                        <CollapsibleContent className="space-y-2">
                                            {backupFiles.length > 0 ? (
                                                backupFiles.map(
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
                                <div>
                                    <Collapsible>
                                        <div className="flex items-center gap-4">
                                            <p>Attachment Files</p>
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                >
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
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
