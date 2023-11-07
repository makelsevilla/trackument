import { Link, router } from "@inertiajs/react";
import { format } from "date-fns";
import { Label } from "@/Components/ui/label.jsx";
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover.jsx";
import { cn } from "@/lib/utils.js";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/Components/ui/calendar.jsx";
import { useEffect, useState } from "react";

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
    url,
    childParams,
    children,
    ...props
}) {
    const { searchParams } = new URL(location.href);
    const [params, setParams] = useState({
        category: searchParams.get("category") || "",
        search: searchParams.get("search") || "",
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
        <form onSubmit={handleFilterApply} className="flex flex-wrap gap-4">
            <div className="w-44">
                <Input
                    value={params.search}
                    onChange={(e) =>
                        setParams({ ...params, search: e.target.value })
                    }
                    placeholder="Search..."
                />
            </div>
            <div className="w-44">
                <Select
                    value={params.category}
                    onValueChange={(value) =>
                        setParams({ ...params, category: value })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Search Category" />
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
            {/*Additional Filter From Child Component*/}
            {children}

            <div className="space-x-2">
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
