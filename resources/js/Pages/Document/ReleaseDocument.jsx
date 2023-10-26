import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import DashboardHeader from "@/Components/DashboardHeader.jsx";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/Components/ui/table.jsx";
import { Label } from "@/Components/ui/label.jsx";
import { Input } from "@/Components/ui/input.jsx";
import { ucwords } from "@/lib/utils.js";
import InputError from "@/Components/InputError.jsx";
import InputHelper from "@/Components/InputHelper.jsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select.jsx";
import { useForm } from "@inertiajs/react";

export default function ReleaseDocument({ auth, document, releaseActions }) {
    const { data, setData, errors } = useForm({
        release_action: "",
    });

    console.log(releaseActions);
    return (
        <AuthenticatedLayout auth={auth}>
            <div className="flex flex-col items-start gap-8">
                <DashboardHeader heading="Release Document" />
                <div className="w-full">
                    <div className="max-w-xl px-2">
                        <Table>
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

                        <div>
                            <div className="mt-4 grid w-full gap-1.5">
                                <Label htmlFor="release_action">Title</Label>
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
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
