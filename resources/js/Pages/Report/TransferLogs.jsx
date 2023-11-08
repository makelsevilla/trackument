import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card.jsx";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
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
import { Head } from "@inertiajs/react";

const filtersValueMapping = {
    status: {
        pending: "Pending",
        completed: "Completed",
    },
    date_range_by: {
        transferred_at: "Date Transferred",
        completed_at: "Date Completed",
    },
    order: {
        asc: "Ascending",
        desc: "Descending",
    },
    sortBy: {
        transferred_at: "Date Transferred",
        completed_at: "Date Completed",
    },
    category: {
        tracking_code: "Document Code",
        sender: "Sender",
        receiver: "Receiver",
    },
};
export default function TransferLogs({ transfers, filters }) {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div className="container mx-auto mt-10 space-y-4">
            <Head title="Transfer Logs Report" />
            <Button onClick={handlePrint}>Print Report</Button>
            <Card ref={componentRef}>
                <CardHeader>
                    <CardTitle className="text-center">
                        Transfer Logs Report
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <h4 className="font-bold">Filters Applied:</h4>
                    <span className="flex flex-wrap gap-6">
                        {Object.entries(filters)
                            .filter(([key, value]) => {
                                const keysToExclude = ["perPage"];

                                return !keysToExclude.includes(key);
                            })
                            .map(([key, value]) => {
                                return (
                                    <div className=" p-2">
                                        <div className="uppercase">{key}:</div>
                                        <div>
                                            {filtersValueMapping?.[key]?.[
                                                value
                                            ] ||
                                                value ||
                                                "Not specified"}
                                        </div>
                                    </div>
                                );
                            })}
                    </span>
                    <Table className="mt-4">
                        <TableHeader className="bg-secondary">
                            <TableRow>
                                <TableHead>Document Code</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date Transferred</TableHead>
                                <TableHead>Date Completed</TableHead>
                                <TableHead>Sender</TableHead>
                                <TableHead>Receiver</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {transfers.map((transfer, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>
                                        {transfer?.document?.tracking_code}
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        {transfer.status}
                                    </TableCell>
                                    <TableCell>
                                        {transfer?.transferred_at &&
                                            dayjs(
                                                transfer.transferred_at,
                                            ).format("MMM DD YYYY hh:mm A")}
                                    </TableCell>
                                    <TableCell>
                                        {transfer?.completed_at
                                            ? dayjs(
                                                  transfer.transferred_at,
                                              ).format("MMM DD YYYY hh:mm A")
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {transfer?.sender?.name}
                                    </TableCell>
                                    <TableCell>
                                        {transfer?.receiver?.name}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
