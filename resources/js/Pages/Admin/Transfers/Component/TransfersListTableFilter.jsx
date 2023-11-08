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
import { addDays, format } from "date-fns";
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
        value: "tracking_code",
        label: "Document Code",
    },
    {
        value: "sender",
        label: "Sender",
    },
    {
        value: "receiver",
        label: "Receiver",
    },
];

const sortColumns = [
    {
        value: "transferred_at",
        label: "Date Transferred",
    },
    {
        value: "completed_at",
        label: "Date Completed",
    },
];

const dateNames = [
    {
        value: "transferred_at",
        label: "Date Transferred",
    },
    {
        value: "completed_at",
        label: "Date Completed",
    },
];

export default function TransfersListTableFilter({ ...props }) {
    const {
        props: { filters },
    } = usePage();
    const [params, setParams] = useState({
        status: filters?.status || "",
    });

    return (
        <TableFilter
            childParams={params}
            sortColumns={sortColumns}
            categories={categories}
            dateNames={dateNames}
            url={route("admin.document-transfers.index")}
        >
            <div className="w-32">
                <Label className="text-xs">Status</Label>
                <Select
                    value={params.status}
                    onValueChange={(value) =>
                        setParams({ ...params, status: value })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </TableFilter>
    );
}
