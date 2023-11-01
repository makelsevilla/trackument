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
    const [date, setDate] = useState(
        filters?.date || {
            from: null,
            to: null,
        },
    );

    const documents = paginatedDocuments.data;

    function handleFilterApply() {
        console.log({ date, filter, category });
        router.get(
            route("documents.lists.finalized", {
                date_from: date.from,
                date_to: date.to,
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
                    <div className="mb-4">
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
                            <div className="grid gap-2">
                                <Label>Date Range</Label>
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
                                                <span>Pick a date</span>
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
                                            disabled={(date) =>
                                                date > new Date() ||
                                                date < new Date("2023-01-01")
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="ml-auto">
                                <Button
                                    onClick={handleFilterApply}
                                    className="hover:bg-primary hover:text-primary-foreground"
                                    variant="secondary"
                                >
                                    <Icons.filter className="mr-2 h-4 w-4" />
                                    Apply
                                </Button>
                            </div>
                        </div>
                    </div>
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
