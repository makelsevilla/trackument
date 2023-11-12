import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, Link, router, useForm } from "@inertiajs/react";
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
import FinalizedTableFilter from "@/Pages/Document/Lists/Components/FinalizedTableFilter.jsx";
import PaginationButtons from "@/Pages/Document/Lists/Components/PaginationButtons.jsx";
import TableFilter from "@/Pages/Document/Lists/Components/TableFilter.jsx";
import { finalizedCategories } from "@/Pages/Document/Lists/Components/pageFilterCategories.js";
import Breadcrumb from "@/Components/Breadcrumb.jsx";
import TablePaginationButtons from "@/Components/TablePaginationButtons.jsx";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert.jsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu.jsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
} from "@/Components/ui/alert-dialog.jsx";
import { useState } from "react";

export default function Finalized({
    auth,
    paginatedDocuments: { data: documents, ...paginate },
    filters,
    unreleasedCount,
}) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Finalized Documents" />
            <div className="flex flex-col justify-start gap-8">
                <Breadcrumb
                    items={[
                        {
                            label: "Home",
                            href: route("dashboard"),
                        },
                        {
                            label: "My Documents",
                        },
                    ]}
                />

                {unreleasedCount > 0 && (
                    <Alert>
                        <Icons.info className="h-4 w-4" />
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>
                            You have {unreleasedCount} unreleased documents.
                        </AlertDescription>
                    </Alert>
                )}

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
                <div className="flex flex-col gap-4 p-2">
                    {/*Table Filter*/}
                    <FinalizedTableFilter />

                    {/*Data Table*/}
                    <FinalizedTable documents={documents} />
                    {/*Table Footer*/}
                    <div>
                        {documents.length === 0 && (
                            <div className="text-center text-muted-foreground">
                                No Data Found
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {paginate.from} to {paginate.to} of{" "}
                            {paginate.total} results
                        </div>
                        <TablePaginationButtons paginate={paginate} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function FinalizedTable({ documents }) {
    return (
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
                {documents.map((document, index) => {
                    return (
                        <TableRow key={index}>
                            <TableCell>{document.tracking_code}</TableCell>
                            <TableCell>
                                <div>{document.title}</div>
                            </TableCell>
                            <TableCell>
                                {document?.created_at &&
                                    dayjs(document.created_at).format(
                                        "MMMM DD, YYYY h:mm a ",
                                    )}
                            </TableCell>
                            <TableCell>
                                <div className="space-x-1">
                                    <DocumentAction document={document} />

                                    {/*Release document button*/}
                                    {document?.previous_owner_id === null &&
                                        document.status === "available" && (
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                                asChild
                                            >
                                                <Link
                                                    href={route(
                                                        "documents.release",
                                                        {
                                                            document:
                                                                document.id,
                                                        },
                                                    )}
                                                >
                                                    <Icons.forward className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        )}
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

function DocumentAction({ document }) {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <Icons.moreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link
                            href={route("documents.show", {
                                document: document.id,
                            })}
                        >
                            View Details
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={route("track", {
                                tracking_code: document.tracking_code,
                            })}
                        >
                            Track Document
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
