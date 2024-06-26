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
        value: "owner",
        label: "Owner",
    },
];

const sortColumns = [
    {
        value: "terminated_at",
        label: "Date Tagged",
    },
];

const dateNames = [
    {
        value: "terminated_at",
        label: "Date Tagged",
    },
];

export default function TerminalTableFilter({ ...props }) {
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
            url={route("documents.lists.terminal")}
        ></TableFilter>
    );
}
