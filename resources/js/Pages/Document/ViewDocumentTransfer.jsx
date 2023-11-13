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
import { Button } from "@/Components/ui/button.jsx";
import { Separator } from "@/Components/ui/separator.jsx";
import dayjs from "dayjs";
import { Badge } from "@/Components/ui/badge.jsx";
import { Link } from "@inertiajs/react";
import Icons from "@/Components/Icons.jsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog.jsx";

export default function ViewDocumentTransfer({
    auth,
    transferDetails,
    documentDetails,
    withActionButtons,
    withDocumentLink,
}) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="flex flex-col items-start gap-8">
                <div className="flex w-full">
                    {withActionButtons &&
                        (transferDetails.receiver_id === auth.user.id ? (
                            <div className="space-x-2">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="sm" variant="secondary">
                                            <Icons.fileInput className="mr-2 h-5 w-5" />
                                            Accept
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Accept Document Transfer
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to accept
                                                the document transfer?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction asChild>
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
                                                    Accept Document
                                                </Link>
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="sm" variant="destructive">
                                            <Icons.fileX2 className="mr-2 h-5 w-5" />
                                            Reject
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Reject Document Transfer
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to reject
                                                the document transfer?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                asChild
                                                className="bg-destructive text-destructive-foreground"
                                            >
                                                <Link
                                                    as="button"
                                                    method="post"
                                                    href={route(
                                                        "documents.transfer.reject",
                                                        {
                                                            documentTransfer:
                                                                transferDetails.id,
                                                        },
                                                    )}
                                                >
                                                    Reject Document
                                                </Link>
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        ) : (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="destructive">
                                        <Icons.abort className="mr-2 h-5 w-5" />
                                        Cancel Transfer
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Cancel Document Transfer
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to cancel the
                                            document transfer?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            asChild
                                            className="bg-destructive text-destructive-foreground"
                                        >
                                            <Link
                                                href={route(
                                                    "documents.transfer.cancel",
                                                    {
                                                        documentTransfer:
                                                            transferDetails.id,
                                                    },
                                                )}
                                                method="post"
                                                as="button"
                                            >
                                                Cancel Transfer
                                            </Link>
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
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
                    <div className="px-2">
                        {/* Overview of the Document Then Transfer Status*/}
                        <Table className="border">
                            <TableHeader className="bg-secondary">
                                <TableRow>
                                    <TableHead
                                        colspan="2"
                                        className="text-center"
                                    >
                                        Document Overview
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
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
                            <TableHeader className="bg-secondary">
                                <TableRow>
                                    <TableHead
                                        colspan="2"
                                        className="text-center"
                                    >
                                        Transfer Details
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
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
                                            transferDetails.transferred_at,
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
                                                Not yet completed.
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
                                        {transferDetails?.receiver_name ||
                                            transferDetails?.office_name}
                                        {transferDetails?.receiver_id ===
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
