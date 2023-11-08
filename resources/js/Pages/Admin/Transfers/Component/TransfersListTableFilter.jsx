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

export default function TransfersListTableFilter({ ...props }) {
    const {
        props: { filters },
    } = usePage();
    const [params, setParams] = useState({
        status: filters?.status || "",
        date_range_by: filters?.date_range_by || "",
        date: {
            from: filters?.date?.from ? new Date(filters?.date?.from) : null,
            to: filters?.date?.to ? new Date(filters?.date?.to) : null,
        },
    });

    return (
        <TableFilter
            childParams={params}
            sortColumns={sortColumns}
            categories={categories}
            url={route("admin.document-transfers.index")}
        >
            <div className="flex items-end gap-1.5">
                <div className="w-44">
                    <Label className="text-xs">Date Range By:</Label>
                    <Select
                        value={params.date_range_by}
                        onValueChange={(value) =>
                            setParams({ ...params, date_range_by: value })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="transferred_at">
                                Date Transferred
                            </SelectItem>
                            <SelectItem value="completed_at">
                                Date Completed
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col">
                    <Label className="text-xs">Date Range:</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    " justify-start text-left font-normal",
                                    !params.date && "text-muted-foreground",
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {params.date?.from ? (
                                    params.date.to ? (
                                        <>
                                            {format(
                                                params.date.from,
                                                "LLL dd, y",
                                            )}{" "}
                                            -{" "}
                                            {format(
                                                params.date.to,
                                                "LLL dd, y",
                                            )}
                                        </>
                                    ) : (
                                        format(params.date.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Date Range</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="center">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={params.date?.from}
                                selected={params.date}
                                onSelect={(val) =>
                                    setParams({ ...params, date: val })
                                }
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="w-32">
                <Label className="text-xs">Status</Label>
                <Select
                    value={params.status}
                    onValueChange={(value) =>
                        setParams({ ...params, status: value })
                    }
                >
                    <SelectTrigger>
                        <SelectValue />
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
