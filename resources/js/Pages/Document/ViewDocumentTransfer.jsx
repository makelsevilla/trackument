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
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card.jsx";
import { Label } from "@/Components/ui/label.jsx";
import { ucwords } from "@/lib/utils.js";
import TruckSvg from "@/Components/TruckSvg.jsx";
import FinishFlagSvg from "@/Components/FinishFlagSvg.jsx";
import RouteSvg from "@/Components/RouteSvg.jsx";

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
                        <Button size="sm" asChild variant="link">
                            <Link
                                href={route("documents.show", {
                                    document: documentDetails.id,
                                })}
                            >
                                See Document Details
                            </Link>
                        </Button>
                    )}
                </div>
                <div className="w-full">
                    <div className="px-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Document Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-6">
                                <div className="grid gap-1.5 border-l-2 px-2">
                                    <Label>Tracking Code:</Label>
                                    <p className="capitalize">
                                        {documentDetails.tracking_code}
                                    </p>
                                </div>
                                <div className="grid gap-1.5 border-l-2 px-2">
                                    <Label>Owner:</Label>
                                    <p className="capitalize">
                                        {documentDetails.owner_name}
                                    </p>
                                </div>
                                <div className="grid gap-1.5 border-l-2 px-2">
                                    <Label>Title:</Label>
                                    <p className="capitalize">
                                        {documentDetails.title}
                                    </p>
                                </div>
                                <div className="grid w-full gap-1.5 border-l-2 px-2">
                                    <Label>Purposes:</Label>
                                    <p>
                                        {JSON.parse(
                                            documentDetails.purpose,
                                        ).map((purpose, index) => (
                                            <span key={index}>
                                                {ucwords(purpose) + ", "}
                                            </span>
                                        ))}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Transfer Details</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-6">
                                <div className="grid gap-1.5 border-l-2 px-2">
                                    <Label>Status:</Label>
                                    <Badge className="capitalize">
                                        {transferDetails.status}
                                    </Badge>
                                </div>
                                <ol className="flex w-full items-start">
                                    <li className="w-full">
                                        <div className="flex items-center after:inline-block after:h-1 after:w-full after:border-4 after:border-b after:border-blue-300 after:content-[''] dark:text-blue-500 dark:after:border-blue-800">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full lg:h-12 lg:w-12">
                                                <TruckSvg className="h-8 w-8 lg:h-10 lg:w-10" />
                                            </span>
                                        </div>
                                    </li>
                                    <li
                                        className={`${
                                            transferDetails.status ===
                                            "completed"
                                                ? "after:border-blue-300"
                                                : "after:border-gray-300"
                                        } flex w-full items-center after:inline-block after:h-1 after:w-full after:border-4 after:border-b  after:content-[''] dark:after:border-gray-700`}
                                    >
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 lg:h-12 lg:w-12">
                                            <RouteSvg className="h-8 w-8 lg:h-10 lg:w-10" />
                                        </span>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 lg:h-12 lg:w-12">
                                                <FinishFlagSvg className="h-8 w-8 lg:h-10 lg:w-10" />
                                            </span>
                                        </div>
                                    </li>
                                </ol>
                                <div className="flex w-full justify-between">
                                    <div className="grid gap-1.5 border-l-2 px-2">
                                        <Label>Sender:</Label>
                                        <p className="capitalize">
                                            {transferDetails.sender_name}
                                            {transferDetails.sender_id ===
                                                auth.user.id && " (You)"}
                                        </p>
                                    </div>
                                    <div className="grid gap-1.5 border-l-2 px-2">
                                        <Label>Receiver:</Label>
                                        <p className="capitalize">
                                            {transferDetails?.receiver_name ||
                                                transferDetails?.office_name}
                                            {transferDetails?.receiver_id ===
                                                auth.user.id && " (You)"}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid gap-1.5 border-l-2 px-2">
                                    <Label>Sender Release Action:</Label>
                                    <p className="capitalize">
                                        {transferDetails.release_action}
                                    </p>
                                </div>

                                <div className="grid gap-1.5 border-l-2 px-2">
                                    <Label>Date Released:</Label>
                                    <p className>
                                        {dayjs(
                                            transferDetails.transferred_at,
                                        ).format("MMMM DD, YYYY")}
                                        <div>
                                            {dayjs(
                                                transferDetails.transferred_at,
                                            ).format("h:mm a")}
                                        </div>
                                    </p>
                                </div>
                                <div className="grid gap-1.5 border-l-2 px-2">
                                    <Label>Date Completed:</Label>
                                    <p className="capitalize">
                                        {transferDetails.is_completed ? (
                                            <>
                                                {dayjs(
                                                    transferDetails.completed_at,
                                                ).format("MMMM DD, YYYY")}
                                                <div>
                                                    {dayjs(
                                                        transferDetails.completed_at,
                                                    ).format("h:mm a")}
                                                </div>
                                            </>
                                        ) : (
                                            <p
                                                className="text-muted-foreground
                                            "
                                            >
                                                Not yet completed.
                                            </p>
                                        )}
                                    </p>
                                </div>
                                <div className="grid w-full gap-1.5 border-l-2 px-2">
                                    <Label>Sender Comment:</Label>
                                    <p>{transferDetails.comment || "None"}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
