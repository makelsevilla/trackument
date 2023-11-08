import TableFilter from "@/Components/TableFilter.jsx";
import { Label } from "@/Components/ui/label.jsx";
import { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover.jsx";
import { Button } from "@/Components/ui/button.jsx";
import { cn } from "@/lib/utils.js";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/Components/ui/calendar.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select.jsx";
import { usePage } from "@inertiajs/react";

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

export default function UsersListTableFilter({ ...props }) {
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
            url={route("admin.users.index")}
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
