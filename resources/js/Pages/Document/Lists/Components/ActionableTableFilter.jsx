import TableFilter from "@/Components/TableFilter.jsx";
import { useState } from "react";
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
        value: "sender",
        label: "Sender",
    },
];

const sortColumns = [
    {
        value: "completed_at",
        label: "Date Received",
    },
];

const dateNames = [
    {
        value: "completed_at",
        label: "Date Received",
    },
];

export default function ActionableTableFilter({ ...props }) {
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
            url={route("documents.lists.actionable")}
        ></TableFilter>
    );
}
