import { Link, router } from "@inertiajs/react";
import { format } from "date-fns";
import { Label } from "@/Components/ui/label.jsx";
import { Input } from "@/Components/ui/input.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select.jsx";
import { Button } from "@/Components/ui/button.jsx";
import Icons from "@/Components/Icons.jsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover.jsx";
import { cn } from "@/lib/utils.js";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/Components/ui/calendar.jsx";
import { useState } from "react";

export default function ActionableTableFilter({ filters, ...props }) {
    const [category, setCategory] = useState(filters?.category || "");
    const [filter, setFilter] = useState(filters?.filter || "");
    const [date, setDate] = useState({
        from: filters?.date?.from ? new Date(filters.date.from) : null,
        to: filters?.date?.to ? new Date(filters.date.to) : null,
    });

    function handleFilterApply(e) {
        e.preventDefault();
        router.get(
            route("documents.lists.actionable", {
                date: {
                    from: date?.from ? format(date.from, "yyyy-MM-dd") : null,
                    to: date?.to ? format(date.to, "yyyy-MM-dd") : null,
                },
                filter,
                category,
            }),
        );
    }

    function handleFilterReset(e) {
        e.preventDefault();
        router.get(route("documents.lists.actionable"));
    }

    const categories = [
        {
            value: "document_title",
            label: "Document Title",
        },
        {
            value: "tracking_code",
            label: "Tracking Code",
        },
        {
            value: "sender",
            label: "Sender",
        },
    ];

    return (
        <form onSubmit={handleFilterApply} className="mb-4">
            <div className="flex items-end gap-4">
                <div className="grid gap-2">
                    <Label>Filter</Label>
                    <Input
                        onChange={(e) => setFilter(e.target.value)}
                        value={filter}
                        className="w-fit"
                        placeholder="Filter text"
                    />
                </div>
                <div className="grid gap-2">
                    <Label>Category</Label>
                    <Select
                        value={category}
                        onValueChange={(value) => setCategory(value)}
                    >
                        <SelectTrigger className="max-w-fit">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category, index) => (
                                <SelectItem key={index} value={category.value}>
                                    {category.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-x-2">
                    <Button
                        type="submit"
                        className="hover:bg-primary hover:text-primary-foreground"
                        variant="secondary"
                    >
                        <Icons.filter className="mr-2 h-4 w-4" />
                        Apply
                    </Button>
                    <Button onClick={handleFilterReset} variant="ghost">
                        <Icons.loading className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                </div>
                <div className="ml-auto">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    " justify-start text-left font-normal",
                                    !date && "text-muted-foreground",
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "LLL dd, y")} -{" "}
                                            {format(date.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd, y")
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
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </form>
    );
}
