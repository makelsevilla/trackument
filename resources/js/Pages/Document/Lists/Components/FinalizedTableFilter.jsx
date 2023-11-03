import TableFilter from "@/Pages/Document/Lists/Components/TableFilter.jsx";
import { useState } from "react";
import { Label } from "@/Components/ui/label.jsx";
import { Input } from "@/Components/ui/input.jsx";

export default function FinalizedTableFilter({ ...props }) {
    const [params, setParams] = useState({
        another: "",
    });

    return (
        <TableFilter childParams={params} {...props}>
            <div className="grid gap-2">
                <Label>Another</Label>
                <Input
                    value={params.another}
                    onChange={(e) =>
                        setParams({ ...params, another: e.target.value })
                    }
                />
            </div>
        </TableFilter>
    );
}
