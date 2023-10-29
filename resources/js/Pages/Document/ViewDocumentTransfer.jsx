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

export default function ViewDocumentTransfer({
    auth,
    transferDetails,
    documentDetails,
}) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="flex flex-col items-start gap-8">
                <DashboardHeader heading="Document Transfer" />
                <div className="w-full">
                    <div className="max-w-xl px-2">
                        {/* Overview of the Document Then Transfer Status*/}
                        <Table className="border">
                            <TableCaption>Document Details</TableCaption>
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
                                        Date Received
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
                                                Not yet received.
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
