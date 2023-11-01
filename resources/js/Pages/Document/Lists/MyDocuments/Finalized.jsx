import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, Link, router } from "@inertiajs/react";
import DashboardHeader from "@/Components/DashboardHeader.jsx";
import { Button } from "@/Components/ui/button.jsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table.jsx";
import dayjs from "dayjs";
import Icons from "@/Components/Icons.jsx";
import { Input } from "@/Components/ui/input.jsx";
import { Label } from "@/Components/ui/label.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select.jsx";
import DatePickerWithRange from "@/Components/DatePickerWithRange.jsx";
import { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover.jsx";
import { cn } from "@/lib/utils.js";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/Components/ui/calendar.jsx";

export default function Finalized({ auth, paginatedDocuments, filters }) {
    const [category, setCategory] = useState(filters?.category || "");
    const [filter, setFilter] = useState(filters?.filter || "");
    const [date, setDate] = useState({
        from: filters?.date?.from ? new Date(filters.date.from) : null,
        to: filters?.date?.to ? new Date(filters.date.to) : null,
    });

    const documents = paginatedDocuments.data;
    console.log(paginatedDocuments);
    function handleFilterApply(e) {
        e.preventDefault();
        router.get(
            route("documents.lists.finalized", {
                date: {
                    from: date?.from ? format(date.from, "yyyy-MM-dd") : null,
                    to: date?.to ? format(date.to, "yyyy-MM-dd") : null,
                },
                filter,
                category,
            }),
        );
    }

    const categories = [
        {
            value: "document_title",
            label: "Document Title",
        },
        {
            value: "document_type",
            label: "Document Type",
        },
        {
            value: "tracking_code",
            label: "Tracking Code",
        },
    ];
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Finalized Documents" />
            <div className="grid items-start gap-8">
                <DashboardHeader
                    heading="My Documents"
                    text="Finalized documents."
                >
                    <Button asChild>
                        <Link
                            href={route("documents.store")}
                            method="post"
                            as="button"
                        >
                            New Document
                        </Link>
                    </Button>
                </DashboardHeader>
                <div className="px-2">
                    {/*Table Filters*/}
                    <form onSubmit={handleFilterApply} className="mb-4">
                        <div className="flex items-end gap-4">
                            <div className="grid gap-2">
                                <Label>Filter</Label>
                                <Input
                                    onChange={(e) => setFilter(e.target.value)}
                                    value={filter}
                                    className="w-fit"
                                    placeholder="Filter text"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Category</Label>
                                <Select
                                    value={category}
                                    onValueChange={(value) =>
                                        setCategory(value)
                                    }
                                >
                                    <SelectTrigger className="max-w-fit">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category, index) => (
                                            <SelectItem
                                                key={index}
                                                value={category.value}
                                            >
                                                {category.label}
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
                                <Button variant="ghost" asChild>
                                    <Link
                                        href={route(
                                            "documents.lists.finalized",
                                        )}
                                    >
                                        <Icons.loading className="mr-2 h-4 w-4" />
                                        Reset
                                    </Link>
                                </Button>
                            </div>
                            <div className="ml-auto">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date"
                                            variant={"outline"}
                                            className={cn(
                                                " justify-start text-left font-normal",
                                                !date &&
                                                    "text-muted-foreground",
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date?.from ? (
                                                date.to ? (
                                                    <>
                                                        {format(
                                                            date.from,
                                                            "LLL dd, y",
                                                        )}{" "}
                                                        -{" "}
                                                        {format(
                                                            date.to,
                                                            "LLL dd, y",
                                                        )}
                                                    </>
                                                ) : (
                                                    format(
                                                        date.from,
                                                        "LLL dd, y",
                                                    )
                                                )
                                            ) : (
                                                <span>Date Range</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="center"
                                    >
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={date?.from}
                                            selected={date}
                                            onSelect={setDate}
                                            numberOfMonths={2}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </form>

                    {/*Data Table*/}
                    <Table>
                        <TableHeader className="bg-secondary">
                            <TableRow>
                                <TableHead>Code & Type</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Date Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents &&
                                documents.map((document, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="font-bold">
                                                    {document.tracking_code}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {
                                                        document.document_type_name
                                                    }
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {document.title}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {dayjs(
                                                    document.created_at,
                                                ).format(
                                                    "MMMM DD, YYYY h:mm a ",
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    asChild
                                                >
                                                    <Link
                                                        href={route(
                                                            "documents.show",
                                                            {
                                                                document:
                                                                    document.id,
                                                            },
                                                        )}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <Icons.view className="h-4 w-4" />
                                                        <span>View</span>
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>

                    {/*Pagination*/}
                    {paginatedDocuments.last_page > 1 && (
                        <div className="flex justify-end pt-4">
                            <div className="flex items-center gap-2">
                                {paginatedDocuments.prev_page_url ? (
                                    <Button variant="outline" asChild>
                                        <Link
                                            href={
                                                paginatedDocuments.prev_page_url
                                            }
                                        >
                                            Previous
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button asChild variant="outline" disabled>
                                        Previous
                                    </Button>
                                )}

                                {paginatedDocuments.next_page_url ? (
                                    <Button variant="outline" asChild>
                                        <Link
                                            href={
                                                paginatedDocuments.next_page_url
                                            }
                                        >
                                            Next
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button asChild variant="outline" disabled>
                                        Next
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
