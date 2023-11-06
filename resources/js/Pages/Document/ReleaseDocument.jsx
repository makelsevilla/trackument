import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import DashboardHeader from "@/Components/DashboardHeader.jsx";
import {
    Table,
    TableBody,
    TableCell,
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
import { useForm } from "@inertiajs/react";
import Breadcrumb from "@/Components/Breadcrumb.jsx";
import { Textarea } from "@/Components/ui/textarea.jsx";
import { Button } from "@/Components/ui/button.jsx";
import DocumentFilesForm from "@/Pages/Document/DocumentFilesForm.jsx";

export default function ReleaseDocument({
    auth,
    document,
    releaseActions,
    offices,
}) {
    const { data, setData, errors, post } = useForm({
        release_action: "",
        receiver_id: null,
        comment: "",
    });

    function handleSubmit() {
        post(route("documents.transfer", { document: document.id }));
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="flex flex-col items-start gap-8">
                <Breadcrumb
                    items={[
                        {
                            href: route("documents.show", {
                                document: document.id,
                            }),
                            label: document.tracking_code,
                        },
                        {
                            label: "Release",
                        },
                    ]}
                />
                <DashboardHeader heading="Release Document" />
                <div className="w-full">
                    <div className="max-w-xl px-2">
                        <Table className="border">
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-bold">
                                        Tracking Code
                                    </TableCell>
                                    <TableCell>
                                        {document.tracking_code}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold">
                                        Title
                                    </TableCell>
                                    <TableCell>{document.title}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold">
                                        Owner
                                    </TableCell>
                                    <TableCell>{document.owner.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold">
                                        Previous Owner
                                    </TableCell>
                                    <TableCell>
                                        {document?.previous_owner
                                            ? document.previous_owner.name
                                            : "None"}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <div className="items-start gap-4 pt-8">
                            <div className="mt-4 grid w-full gap-1.5">
                                <Label htmlFor="receiver">
                                    Receiving Office
                                </Label>
                                <Select
                                    value={data.receiver_id}
                                    onValueChange={(value) =>
                                        setData("receiver_id", value)
                                    }
                                    id="receiver"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select offce" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {offices.map((office, index) => {
                                                return (
                                                    <SelectItem
                                                        value={office.id}
                                                        key={index}
                                                    >
                                                        {ucwords(office.name)}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={errors.receiver_id}
                                    className="mt-2"
                                />
                            </div>
                            <div className="mt-4 grid w-full gap-1.5">
                                <Label htmlFor="release_action">Action</Label>
                                <Select
                                    value={data.release_action}
                                    onValueChange={(value) =>
                                        setData("release_action", value)
                                    }
                                    id="release_action"
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select document action" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {releaseActions?.map(
                                                (action, index) => {
                                                    return (
                                                        <SelectItem
                                                            key={index}
                                                            value={
                                                                action.action_name
                                                            }
                                                        >
                                                            <span>
                                                                {ucwords(
                                                                    action.action_name,
                                                                )}
                                                            </span>
                                                        </SelectItem>
                                                    );
                                                },
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={errors.release_action}
                                    className="mt-2"
                                />
                            </div>

                            {/* Comment */}
                            <div className="mt-4 grid w-full gap-1.5">
                                <Label htmlFor="comment">Comment</Label>
                                <Textarea
                                    onChange={(e) =>
                                        setData("comment", e.target.value)
                                    }
                                    value={data.comment}
                                    id="comment"
                                />
                                <InputError
                                    message={errors.comment}
                                    className="mt-2"
                                />
                            </div>

                            {/* Document Files */}
                            <div className="mt-8 grid w-full gap-4">
                                <Label className="text-xl">
                                    Document Files
                                </Label>
                                <DocumentFilesForm
                                    documentId={document.id}
                                    withNameInput
                                />
                            </div>

                            <div className="flex justify-end pt-6">
                                <Button onClick={() => handleSubmit()}>
                                    Release Document
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
