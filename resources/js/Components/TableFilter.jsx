import { router, usePage } from "@inertiajs/react";

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
import { useState } from "react";
import { Label } from "@/Components/ui/label.jsx";

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
    sortColumns,
    url,
    childParams,
    children,
    ...props
}) {
    const {
        props: { filters },
    } = usePage();
    const [params, setParams] = useState({
        category: filters?.category || "",
        search: filters?.search || "",
        sortBy: filters?.sortBy || "",
        order: filters?.order || "",
        perPage: filters?.perPage || "",
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
        <form
            onSubmit={handleFilterApply}
            className="flex flex-wrap items-end gap-4"
        >
            <div className="flex items-end gap-1.5">
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
                    <Label className="text-xs">Search By:</Label>
                    <Select
                        value={params.category}
                        onValueChange={(value) =>
                            setParams({ ...params, category: value })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
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
            </div>

            {sortColumns && (
                <div className="flex gap-1.5">
                    <div className="w-44">
                        <Label className="text-xs">Sort By:</Label>
                        <Select
                            value={params.sortBy}
                            onValueChange={(value) =>
                                setParams({ ...params, sortBy: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {sortColumns.map((column, index) => (
                                    <SelectItem
                                        key={index}
                                        value={column.value}
                                    >
                                        {column.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-44">
                        <Label className="text-xs">Order:</Label>
                        <Select
                            value={params.order}
                            onValueChange={(value) =>
                                setParams({ ...params, order: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Descending</SelectItem>
                                <SelectItem value="asc">Ascending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {/*Additional Filter From Child Component*/}
            {children}

            <div className="w-20">
                <Label className="text-xs">Per page:</Label>
                <Select
                    value={params.perPage}
                    onValueChange={(value) =>
                        setParams({ ...params, perPage: value })
                    }
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {[5, 10, 15, 20, 25, 50].map((item, index) => (
                            <SelectItem key={index} value={item.toString()}>
                                {item}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
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
