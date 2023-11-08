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

const dateNames = [
    {
        value: "created_at",
        label: "Date Created",
    },
];

export default function DocumentTypesListTableFilter({ ...props }) {
    const {
        props: { filters },
    } = usePage();

    return (
        <TableFilter
            sortColumns={sortColumns}
            categories={categories}
            dateNames={dateNames}
            url={route("admin.document-types.index")}
        ></TableFilter>
    );
}
