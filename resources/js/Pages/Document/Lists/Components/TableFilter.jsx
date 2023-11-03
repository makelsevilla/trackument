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

/**
 * @typedef {Object} Categories
 * @property {string} value
 * @property {string} label
 */

/**
 *
 * @param filters
 * @param [{Categories}] categories
 * @param url
 * @param props
 * @param childParams
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export default function TableFilter({
    filters,
    categories,
    url,
    childParams,
    children,
    ...props
}) {
    const [params, setParams] = useState({
        category: filters?.category || "",
        filter: filters?.filter || "",
        date: {
            from: filters?.date?.from ? new Date(filters.date.from) : null,
            to: filters?.date?.to ? new Date(filters.date.to) : null,
        },
    });

    function handleFilterApply(e) {
        e.preventDefault();
        // i'll assume that router.get data puts the data in the url
        router.get(url, { ...params, ...childParams });
    }

    function handleFilterReset(e) {
        e.preventDefault();
        router.get(url);
    }

    return (
        <form onSubmit={handleFilterApply} className="mb-4">
            <div className="flex items-end gap-4">
                <div className="grid gap-2">
                    <Label>Filter</Label>
                    <Input
                        onChange={(e) =>
                            setParams({ ...params, filter: e.target.value })
                        }
                        value={params.filter}
                        className="w-fit"
                        placeholder="Filter text"
                    />
                </div>
                <div className="grid gap-2">
                    <Label>Category</Label>
                    <Select
                        value={params.category}
                        onValueChange={(value) =>
                            setParams({ ...params, category: value })
                        }
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
                {/*Additional Filter From Child Component*/}
                {children}
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
        </form>
    );
}
