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
];

const sortColumns = [
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

export default function FinalizedTableFilter({ ...props }) {
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
            url={route("documents.lists.finalized")}
        ></TableFilter>
    );
}
