import { Head, Link } from "@inertiajs/react";
import DashboardHeader from "@/Components/DashboardHeader.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table.jsx";
import Icons from "@/Components/Icons.jsx";
import { Button } from "@/Components/ui/button.jsx";
import dayjs from "dayjs";
import FinalizedTableFilter from "@/Pages/Document/Lists/Components/FinalizedTableFilter.jsx";
import TerminalTableFilter from "@/Pages/Document/Lists/Components/TerminalTableFilter.jsx";
import PaginationButtons from "@/Pages/Document/Lists/Components/PaginationButtons.jsx";

export default function TerminalTagged({ auth, paginatedDocuments, filters }) {
    const documents = paginatedDocuments.data;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Terminal" />
            <div className="grid items-start gap-8">
                <DashboardHeader
                    heading="Documents Terminal"
                    text="Documents destined to your office."
                />
                <div className="px-2">
                    {/*Table Filter*/}
                    <TerminalTableFilter filters={filters} />

                    {/*Data Table*/}
                    <Table>
                        <TableHeader className="bg-secondary">
                            <TableRow>
                                <TableHead>Tracking Code</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Date Tagged</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="text-sm text-muted-foreground">
                                                No documents found.
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                            {documents.map((doc, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className="font-bold">
                                            {doc.tracking_code}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {doc.document_type_name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{doc.title}</TableCell>
                                    <TableCell>
                                        {doc.owner_name}

                                        <span>
                                            {doc.owner_id === auth.user.id &&
                                                "(You)"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {dayjs(document.terminated_at).format(
                                            "MMMM DD, YYYY h:mm a ",
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="icon"
                                        >
                                            <Link
                                                href={route(
                                                    "documents.show",
                                                    doc.id,
                                                )}
                                            >
                                                <Icons.view className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
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
