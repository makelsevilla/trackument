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
import { Input } from "@/Components/ui/input.jsx";
import InputHelper from "@/Components/InputHelper.jsx";
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
        receiver_name: "",
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
                            <div>
                                <div className="mt-4 grid w-full gap-1.5">
                                    <Label htmlFor="receiver">
                                        Receiving Office / Individual
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
                                                <SelectItem value={null}>
                                                    To Individual
                                                </SelectItem>
                                                {offices.map(
                                                    (office, index) => {
                                                        return (
                                                            <SelectItem
                                                                value={
                                                                    office.id
                                                                }
                                                                key={index}
                                                            >
                                                                {ucwords(
                                                                    office.name,
                                                                )}
                                                            </SelectItem>
                                                        );
                                                    },
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={errors.receiver_id}
                                        className="mt-2"
                                    />
                                </div>
                                {data.receiver_id === null && (
                                    <div className="mt-2 w-full">
                                        <Input
                                            value={data.receiver_name}
                                            onChange={(e) =>
                                                setData(
                                                    "receiver_name",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Individual Name"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.receiver_name}
                                        />
                                    </div>
                                )}
                                <InputHelper className="mt-2">
                                    Note: Releasing to an individual will
                                    automatically tag the document as terminal.
                                </InputHelper>
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
                                <AlertDialog>
                                    <AlertDialogTrigger>
                                        <Button>Release Document</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Confirm Release
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Make sure that you have selected
                                                the correct Receiver and Action
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleSubmit()}
                                            >
                                                Release
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
