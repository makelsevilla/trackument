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

export default function UsersListTableFilter({ ...props }) {
    const { searchParams } = new URL(location.href);
    const [params, setParams] = useState({
        role: searchParams.get("role") || "",
        created_at: {
            from: searchParams.get("created_at[from]")
                ? new Date(searchParams.get("created_at[from]"))
                : null,
            to: searchParams.get("created_at[to]")
                ? new Date(searchParams.get("created_at[to]"))
                : null,
        },
    });

    return (
        <TableFilter
            childParams={params}
            categories={categories}
            url={route("admin.users.index")}
        >
            <div className="w-44">
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
            <div className="flex items-center space-x-2">
                <Label>Date Created:</Label>
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
