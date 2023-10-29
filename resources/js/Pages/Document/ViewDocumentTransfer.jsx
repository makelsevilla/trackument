import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import DashboardHeader from "@/Components/DashboardHeader.jsx";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table.jsx";
import { Label } from "@/Components/ui/label.jsx";
import { cn, ucwords } from "@/lib/utils.js";
import InputError from "@/Components/InputError.jsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select.jsx";
import Breadcrumb from "@/Components/Breadcrumb.jsx";
import { Textarea } from "@/Components/ui/textarea.jsx";
import { Button } from "@/Components/ui/button.jsx";
import DocumentFilesForm from "@/Pages/Document/DocumentFilesForm.jsx";
import { Separator } from "@/Components/ui/separator.jsx";
import dayjs from "dayjs";
import { Badge } from "@/Components/ui/badge.jsx";
import { Link } from "@inertiajs/react";
import Icons from "@/Components/Icons.jsx";

export default function ViewDocumentTransfer({
    auth,
    transferDetails,
    documentDetails,
    withActionButtons,
    withDocumentLink,
}) {
    console.log(withActionButtons);
    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="flex flex-col items-start gap-8">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => history.back()}
                >
                    <Icons.chevronLeft className="h-4 w-4" />
                    <span className="ml-2">Back</span>
                </Button>
                <div className="flex w-full">
                    {withActionButtons &&
                        (transferDetails.receiver_id === auth.user.id ? (
                            <div className="space-x-2">
                                <Button size="sm" variant="secondary" asChild>
                                    <Link
                                        href={route(
                                            "documents.transfer.accept",
                                            {
                                                documentTransfer:
                                                    transferDetails.id,
                                            },
                                        )}
                                        method="post"
                                        as="button"
                                    >
                                        <Icons.fileInput className="mr-2 h-5 w-5" />
                                        Accept
                                    </Link>
                                </Button>

                                <Button size="sm" variant="destructive" asChild>
                                    <Link href="#">
                                        <Icons.fileX2 className="mr-2 h-5 w-5" />
                                        Reject
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-x-2">asdlfak</div>
                        ))}

                    {withDocumentLink && (
                        <div className="ml-auto">
                            <Button size="sm" variant="outline" asChild>
                                <Link
                                    href={route("documents.show", {
                                        document: documentDetails.id,
                                    })}
                                >
                                    <Icons.view className="mr-2 h-5 w-5" />
                                    View Document
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
                <DashboardHeader heading="Document Transfer" />
                <div className="w-full">
                    <div className="max-w-xl px-2">
                        {/* Overview of the Document Then Transfer Status*/}
                        <Table className="border">
                            <TableCaption>Document Overview</TableCaption>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-bold">
                                        Tracking Code
                                    </TableCell>
                                    <TableCell>
                                        {documentDetails.tracking_code}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold">
                                        Document Title
                                    </TableCell>
                                    <TableCell>
                                        {documentDetails.title}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold">
                                        Owner
                                    </TableCell>
                                    <TableCell>
                                        {documentDetails.owner_name}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold">
                                        Document Purpose
                                    </TableCell>
                                    <TableCell>
                                        {JSON.parse(
                                            documentDetails.purpose,
                                        ).map((purpose, index) => (
                                            <div
                                                className="text-sm capitalize"
                                                key={index}
                                            >
                                                <span>{purpose}</span>
                                            </div>
                                        ))}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <Separator className="my-6" />

                        <Table className="border">
                            <TableCaption>Transfer Details</TableCaption>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-bold">
                                        Status
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {transferDetails.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold">
                                        Date Released
                                    </TableCell>
                                    <TableCell>
                                        {dayjs(
                                            transferDetails.transfered_at,
                                        ).format("MMMM DD, YYYY h:mm a")}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold">
                                        Date Completed
                                    </TableCell>
                                    <TableCell>
                                        {transferDetails.is_completed ? (
                                            <>
                                                {dayjs(
                                                    transferDetails.completed_at,
                                                ).format(
                                                    "MMMM DD, YYYY h:mm a",
                                                )}
                                            </>
                                        ) : (
                                            <p
                                                className="text-muted-foreground
                                            "
                                            >
                                                Not completed yet.
                                            </p>
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold">
                                        Sender
                                    </TableCell>
                                    <TableCell>
                                        {transferDetails.sender_name}
                                        {transferDetails.sender_id ===
                                            auth.user.id && " (You)"}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold">
                                        Receiver
                                    </TableCell>
                                    <TableCell>
                                        {transferDetails.receiver_name}
                                        {transferDetails.receiver_id ===
                                            auth.user.id && " (You)"}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold">
                                        Sender's Comment
                                    </TableCell>
                                    <TableCell>
                                        {transferDetails.comment ||
                                            "No Comment"}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
