import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, Link } from "@inertiajs/react";
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

export default function Finalized({ auth, documents }) {
    console.log(documents);
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Finalized Documents" />
            <div className="grid items-start gap-8">
                <DashboardHeader
                    heading="Finalized"
                    text="View finalized documents."
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Date Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents &&
                                documents.map((document, index) => {
                                    return (
                                        <TableRow>
                                            <TableCell>
                                                {document.title}
                                            </TableCell>
                                            <TableCell>
                                                {dayjs(
                                                    document.created_at,
                                                ).format("MMMM DD, YYYY")}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                    >
                                                        <Link
                                                            href={route(
                                                                "documents.edit",
                                                                {
                                                                    document:
                                                                        document.id,
                                                                },
                                                            )}
                                                        >
                                                            <Icons.edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        className="hover:bg-destructive hover:text-destructive-foreground"
                                                        size="icon"
                                                        variant="ghost"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={route(
                                                                "documents.destroy",
                                                                {
                                                                    document:
                                                                        document.id,
                                                                },
                                                            )}
                                                            method="delete"
                                                            as="button"
                                                        >
                                                            <Icons.trash className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
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
