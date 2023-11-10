import TableFilter from "@/Components/TableFilter.jsx";
import { useState } from "react";
import { usePage } from "@inertiajs/react";
import { Label } from "@/Components/ui/label.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select.jsx";

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
    const [params, setParams] = useState({
        release_status: filters?.release_status || "",
    });

    return (
        <TableFilter
            childParams={params}
            sortColumns={sortColumns}
            categories={categories}
            dateNames={dateNames}
            url={route("documents.lists.finalized")}
        >
            <div>
                <Label>Release status:</Label>
                <Select
                    value={params.release_status}
                    onValueChange={(val) =>
                        setParams({ ...params, release_status: val })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select release status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="released">Released</SelectItem>
                        <SelectItem value="unreleased">Unreleased</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </TableFilter>
    );
}
