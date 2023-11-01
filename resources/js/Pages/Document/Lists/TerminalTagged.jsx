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

export default function TerminalTagged({ auth, documents }) {
    console.log(documents);
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Incoming" />
            <div className="grid items-start gap-8">
                <DashboardHeader
                    heading="Documents Terminal"
                    text="Documents destined to your office."
                />
                <div className="px-2">
                    {documents.length > 0 ? (
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
                                                {doc.owner_id ===
                                                    auth.user.id && "(You)"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {dayjs(
                                                document.terminated_at,
                                            ).format("MMMM DD, YYYY h:mm a ")}
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
                    ) : (
                        <div className="flex justify-center border-t py-4 text-muted-foreground">
                            No documents found.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
