import TableFilter from "@/Components/TableFilter.jsx";
import { Label } from "@/Components/ui/label.jsx";
import { useState } from "react";
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
        value: "title",
        label: "Title",
    },
    {
        value: "receiver",
        label: "Receiver",
    },
];

const sortColumns = [
    {
        value: "transferred_at",
        label: "Date Released",
    },
];

const dateNames = [
    {
        value: "transferred_at",
        label: "Date Released",
    },
];

export default function OutgoingTableFilter({ ...props }) {
    const {
        props: { filters },
    } = usePage();
    const [params, setParams] = useState({});

    return (
        <TableFilter
            childParams={params}
            sortColumns={sortColumns}
            categories={categories}
            dateNames={dateNames}
            url={route("documents.lists.outgoing")}
        ></TableFilter>
    );
}
