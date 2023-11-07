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
        label: "Tracking Code",
    },
    {
        value: "title",
        label: "Title",
    },
];

const sortColumns = [
    {
        value: "created_at",
        label: "Date Created",
    },
    {
        value: "title",
        label: "Title",
    },
];

export default function DocumentsListTableFilter({ ...props }) {
    const {
        props: { filters, documentTypes },
    } = usePage();
    const [params, setParams] = useState({
        document_type_id: filters?.document_type_id || "",
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
            url={route("admin.documents.index")}
        >
            <div className="w-44">
                <Label className="text-xs">Type</Label>
                <Select
                    value={params.document_type_id}
                    onValueChange={(value) =>
                        setParams({ ...params, document_type_id: value })
                    }
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {documentTypes.map((type, idx) => (
                            <SelectItem key={idx} value={type.id.toString()}>
                                {type.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
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