import TableFilter from "@/Components/TableFilter.jsx";
import { Label } from "@/Components/ui/label.jsx";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select.jsx";
import { usePage } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table.jsx";
import dayjs from "dayjs";
import UserOperations from "@/Pages/Admin/Users/Components/UserOperations.jsx";

const categories = [
    {
        value: "name",
        label: "Name",
    },
    {
        value: "email",
        label: "Email",
    },
];

const sortColumns = [
    {
        value: "name",
        label: "Name",
    },
    {
        value: "email",
        label: "Email",
    },
    {
        value: "created_at",
        label: "Date Created",
    },
    {
        value: "role",
        label: "Role",
    },
];

const dateNames = [
    {
        value: "created_at",
        label: "Date Created",
    },
];

export default function DeletedUsersTableFilter({ ...props }) {
    const {
        props: { filters },
    } = usePage();
    const [params, setParams] = useState({
        role: filters?.role || "",
    });

    return (
        <TableFilter
            childParams={params}
            sortColumns={sortColumns}
            categories={categories}
            dateNames={dateNames}
            url={route("admin.users.deleted")}
        >
            <div>
                <Label className="text-xs">Role</Label>
                <Select
                    value={params.role}
                    onValueChange={(value) =>
                        setParams({ ...params, role: value })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </TableFilter>
    );
}
