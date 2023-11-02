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
import FinalizedTableFilter from "@/Pages/Document/Lists/Components/FinalizedTableFilter.jsx";
import PaginationButtons from "@/Pages/Document/Lists/Components/PaginationButtons.jsx";

export default function Finalized({ auth, paginatedDocuments, filters }) {
    const documents = paginatedDocuments.data;

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
                    {/*Table Filter*/}
                    <FinalizedTableFilter filters={filters} />

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
                            {documents.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="text-sm text-muted-foreground">
                                                No documents found.
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
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
                            <PaginationButtons
                                next_page_url={paginatedDocuments.next_page_url}
                                prev_page_url={paginatedDocuments.prev_page_url}
                            />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
