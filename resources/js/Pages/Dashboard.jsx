import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
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
import { useEffect } from "react";

export default function Dashboard({ auth, counts, transfers }) {
    useEffect(() => {
        Echo.private(`transfer.${auth.user.id}`).listen(
            "DocumentTransferEvent",
            (e) => {
                router.reload({ only: ["transfers"] });
            },
        );

        return () => {
            Echo.leaveChannel(`transfer.${auth.user.id}`);
        };
    }, []);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />
            <div className="flex flex-col justify-start gap-8">
                <DashboardHeader heading="Dashboard" />
                <div className="space-y-6">
                    <div className="flex flex-wrap gap-4">
                        <div className="min-w-fit flex-1 rounded-xl border p-4 text-center">
                            <h4 className="text-xl font-semibold text-gray-700">
                                My Document
                            </h4>
                            {/*    display the total count of owned documents*/}
                            <div className="text-4xl font-semibold text-gray-700">
                                {counts.myDocument || 0}
                            </div>
                        </div>

                        <div className="min-w-fit flex-1 rounded-xl border p-4 text-center">
                            <h4 className="text-xl font-semibold text-gray-700">
                                Tagged as Terminal
                            </h4>
                            {/*    display the total count of owned documents*/}
                            <div className="text-4xl font-semibold text-gray-700">
                                {counts.taggedAsTerminal || 0}
                            </div>
                        </div>

                        <div className="min-w-fit flex-1 rounded-xl border p-4 text-center">
                            <h4 className="text-xl font-semibold text-gray-700">
                                Draft
                            </h4>
                            {/*    display the total count of owned documents*/}
                            <div className="text-4xl font-semibold text-gray-700">
                                {counts.draftDocument || 0}
                            </div>
                        </div>
                    </div>
                    <div className="rounded border">
                        <div className="flex items-center justify-between border-b bg-red-300">
                            <h4 className="p-4 text-xl font-semibold text-gray-700">
                                Requiring Action
                            </h4>
                            <Button variant="link">
                                <Link
                                    href={route("documents.lists.actionable")}
                                >
                                    View all
                                </Link>
                            </Button>
                        </div>
                        <div className="mt-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tracking Code</TableHead>
                                        <TableHead>Document Title</TableHead>
                                        <TableHead>Sender</TableHead>
                                        <TableHead>Date Received</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transfers.actionable.map(
                                        (document, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    {document.tracking_code}
                                                </TableCell>
                                                <TableCell>
                                                    {document.title}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        document.previous_owner_name
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {document?.document_transfers_completed_at &&
                                                        dayjs(
                                                            document?.document_transfers_completed_at,
                                                        ).format(
                                                            "MMMM DD, YYYY h:mm a",
                                                        )}
                                                </TableCell>
                                            </TableRow>
                                        ),
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="rounded border">
                        <div className="flex items-center justify-between border-b bg-yellow-200">
                            <h4 className="p-4 text-xl font-semibold text-gray-700">
                                Recent Incoming Documents
                            </h4>
                            <Button variant="link">
                                <Link href={route("documents.lists.incoming")}>
                                    View all
                                </Link>
                            </Button>
                        </div>
                        <div className="mt-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tracking Code</TableHead>
                                        <TableHead>Document Title</TableHead>
                                        <TableHead>Sender</TableHead>
                                        <TableHead>Date Released</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transfers.incoming.map((transfer, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                {
                                                    transfer.document
                                                        .tracking_code
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {transfer.document.title}
                                            </TableCell>
                                            <TableCell>
                                                {transfer.sender.name}
                                            </TableCell>
                                            <TableCell>
                                                {dayjs(
                                                    transfer.transferred_at,
                                                ).format("MMM DD, YYYY h:mm a")}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="rounded border">
                        <div className="flex items-center justify-between border-b bg-green-200">
                            <h4 className="p-4 text-xl font-semibold text-gray-700">
                                Recent Outgoing Documents
                            </h4>
                            <Button variant="link">
                                <Link href={route("documents.lists.outgoing")}>
                                    View all
                                </Link>
                            </Button>
                        </div>
                        <div className="mt-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tracking Code</TableHead>
                                        <TableHead>Document Title</TableHead>
                                        <TableHead>Receiver</TableHead>
                                        <TableHead>Date Released</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transfers.outgoing.map((transfer, idx) => {
                                        return (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    {
                                                        transfer.document
                                                            .tracking_code
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {transfer.document.title}
                                                </TableCell>
                                                <TableCell>
                                                    {transfer.receiver.name}
                                                </TableCell>
                                                <TableCell>
                                                    {dayjs(
                                                        transfer.transferred_at,
                                                    ).format(
                                                        "MMM DD, YYYY h:mm a",
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
