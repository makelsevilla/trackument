import { router, usePage } from "@inertiajs/react";

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
import { useState } from "react";
import { Label } from "@/Components/ui/label.jsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover.jsx";
import { cn } from "@/lib/utils.js";
import { Calendar as CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { Calendar } from "@/Components/ui/calendar.jsx";

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
    categories,
    sortColumns,
    dateNames,
    url,
    childParams,
    children,
    ...props
}) {
    const {
        props: { filters },
    } = usePage();
    const [params, setParams] = useState({
        category: filters?.category || "",
        search: filters?.search || "",
        sortBy: filters?.sortBy || "",
        order: filters?.order || "",
        perPage: filters?.perPage || "",
        date_name: filters?.date_name || "",
        date_from: filters?.date_from ? new Date(filters?.date_from) : "",
        date_to: filters?.date_to ? new Date(filters?.date_to) : "",
    });

    function handleFilterApply(e) {
        e.preventDefault();
        router.get(url, { ...params, ...childParams });
    }

    function handleFilterReset(e) {
        e.preventDefault();
        router.get(url);
    }

    return (
        <form
            onSubmit={handleFilterApply}
            className="flex flex-wrap items-end gap-6"
        >
            <div className="flex items-end gap-1.5">
                <div className="w-44">
                    <Input
                        value={params.search}
                        onChange={(e) =>
                            setParams({ ...params, search: e.target.value })
                        }
                        placeholder="Search..."
                    />
                </div>
                <div>
                    <Label className="text-xs">Search By:</Label>
                    <Select
                        value={params.category}
                        onValueChange={(value) =>
                            setParams({ ...params, category: value })
                        }
                    >
                        <SelectTrigger>
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
            </div>

            {sortColumns && (
                <div className="flex gap-1.5">
                    <div>
                        <Label className="text-xs">Sort By:</Label>
                        <Select
                            value={params.sortBy}
                            onValueChange={(value) =>
                                setParams({ ...params, sortBy: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Sort" />
                            </SelectTrigger>
                            <SelectContent>
                                {sortColumns.map((column, index) => (
                                    <SelectItem
                                        key={index}
                                        value={column.value}
                                    >
                                        {column.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-xs">Order:</Label>
                        <Select
                            value={params.order}
                            onValueChange={(value) =>
                                setParams({ ...params, order: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Order" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Descending</SelectItem>
                                <SelectItem value="asc">Ascending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {/*Additional Filter From Child Component*/}
            {children}

            <div>
                <Label className="text-xs">Per page:</Label>
                <Select
                    value={params.perPage}
                    onValueChange={(value) =>
                        setParams({ ...params, perPage: value })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Per Page" />
                    </SelectTrigger>
                    <SelectContent>
                        {[5, 10, 15, 20, 25, 50].map((item, index) => (
                            <SelectItem key={index} value={item.toString()}>
                                {item}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {dateNames && (
                <div className="flex items-end gap-1.5">
                    <div>
                        <Label className="text-xs">Date:</Label>
                        <Select
                            value={params.date_name}
                            onValueChange={(value) =>
                                setParams({ ...params, date_name: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Date" />
                            </SelectTrigger>
                            <SelectContent>
                                {dateNames.map((dateName, index) => (
                                    <SelectItem
                                        key={index}
                                        value={dateName.value}
                                    >
                                        {dateName.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col">
                        <Label className="text-xs">From:</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "justify-start text-left font-normal",
                                        !params.date_from &&
                                            "text-muted-foreground",
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {params.date_from ? (
                                        format(params.date_from, "PPP")
                                    ) : (
                                        <span>From</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                                <Select
                                    onValueChange={(value) =>
                                        setParams({
                                            ...params,
                                            date_from: addDays(
                                                new Date(),
                                                parseInt(value),
                                            ),
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="0">Today</SelectItem>
                                        <SelectItem value="1">
                                            Tomorrow
                                        </SelectItem>
                                        <SelectItem value="3">
                                            In 3 days
                                        </SelectItem>
                                        <SelectItem value="7">
                                            In a week
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="rounded-md border">
                                    <Calendar
                                        mode="single"
                                        selected={params.date_from}
                                        onSelect={(value) =>
                                            setParams({
                                                ...params,
                                                date_from: value,
                                            })
                                        }
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex flex-col">
                        <Label className="text-xs">To:</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "justify-start text-left font-normal",
                                        !params.date_to &&
                                            "text-muted-foreground",
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {params.date_to ? (
                                        format(params.date_to, "PPP")
                                    ) : (
                                        <span>To</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                                <Select
                                    onValueChange={(value) =>
                                        setParams({
                                            ...params,
                                            date_to: addDays(
                                                new Date(),
                                                parseInt(value),
                                            ),
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="0">Today</SelectItem>
                                        <SelectItem value="1">
                                            Tomorrow
                                        </SelectItem>
                                        <SelectItem value="3">
                                            In 3 days
                                        </SelectItem>
                                        <SelectItem value="7">
                                            In a week
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="rounded-md border">
                                    <Calendar
                                        mode="single"
                                        selected={params.date_to}
                                        onSelect={(value) =>
                                            setParams({
                                                ...params,
                                                date_to: value,
                                            })
                                        }
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            )}

            <div className="ml-auto space-x-2">
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
        </form>
    );
}
