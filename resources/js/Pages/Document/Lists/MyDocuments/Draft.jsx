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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog.jsx";

export default function Draft({ auth, documents }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Draft Documents" />
            <div className="grid items-start gap-8">
                <DashboardHeader
                    heading="Drafts"
                    text="Create and manage documents."
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
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="font-bold">
                                                    {document.title}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col items-start">
                                                    <div>
                                                        {dayjs(
                                                            document.created_at,
                                                        ).format("h:mm A")}
                                                    </div>
                                                    <div>
                                                        {dayjs(
                                                            document.created_at,
                                                        ).format(
                                                            "MMMM DD, YYYY",
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        asChild
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
                                                    <AlertDialog>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                className="hover:bg-destructive hover:text-destructive-foreground"
                                                                size="icon"
                                                                variant="ghost"
                                                            >
                                                                <Icons.trash className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Delete
                                                                    Draft?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action
                                                                    cannot be
                                                                    undone
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className="bg-destructive"
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
                                                                        Delete
                                                                    </Link>
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
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
