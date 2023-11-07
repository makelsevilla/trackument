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
        value: "abbreviation",
        label: "Abbreviation",
    },
    {
        value: "name",
        label: "Name",
    },
    {
        value: "description",
        label: "Description",
    },
];

const sortColumns = [
    {
        value: "abbreviation",
        label: "Abbreviation",
    },
    {
        value: "name",
        label: "Name",
    },
    {
        value: "created_at",
        label: "Date Created",
    },
];

export default function DocumentTypesListTableFilter({ ...props }) {
    const {
        props: { filters },
    } = usePage();
    const [params, setParams] = useState({
        created_at: {
            from: filters?.created_at?.from
                ? new Date(filters?.created_at?.from)
                : null,
            to: filters?.created_at?.to
                ? new Date(filters?.created_at?.to)
                : null,
        },
    });

    return (
        <TableFilter
            childParams={params}
            sortColumns={sortColumns}
            categories={categories}
            url={route("admin.document-types.index")}
        >
            <div className="flex flex-col">
                <Label className="text-xs">Date Created:</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                " justify-start text-left font-normal",
                                !params.created_at && "text-muted-foreground",
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {params.created_at?.from ? (
                                params.created_at.to ? (
                                    <>
                                        {format(
                                            params.created_at.from,
                                            "LLL dd, y",
                                        )}{" "}
                                        -{" "}
                                        {format(
                                            params.created_at.to,
                                            "LLL dd, y",
                                        )}
                                    </>
                                ) : (
                                    format(params.created_at.from, "LLL dd, y")
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
                            defaultMonth={params.created_at?.from}
                            selected={params.created_at}
                            onSelect={(val) =>
                                setParams({ ...params, created_at: val })
                            }
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </TableFilter>
    );
}
