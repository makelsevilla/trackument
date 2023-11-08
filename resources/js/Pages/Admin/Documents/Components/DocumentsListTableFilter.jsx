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
        value: "tracking_code",
        label: "Tracking Code",
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
    {
        value: "title",
        label: "Title",
    },
];
const dateNames = [
    {
        value: "created_at",
        label: "Date Created",
    },
];

export default function DocumentsListTableFilter({ ...props }) {
    const {
        props: { filters, documentTypes },
    } = usePage();
    const [params, setParams] = useState({
        document_type_id: filters?.document_type_id || "",
    });

    return (
        <TableFilter
            childParams={params}
            sortColumns={sortColumns}
            categories={categories}
            dateNames={dateNames}
            url={route("admin.documents.index")}
        >
            <div>
                <Label className="text-xs">Type</Label>
                <Select
                    value={params.document_type_id}
                    onValueChange={(value) =>
                        setParams({ ...params, document_type_id: value })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        {documentTypes.map((type, idx) => (
                            <SelectItem key={idx} value={type.id.toString()}>
                                {type.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </TableFilter>
    );
}
