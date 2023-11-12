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
import TerminalTableFilter from "@/Pages/Document/Lists/Components/TerminalTableFilter.jsx";
import Breadcrumb from "@/Components/Breadcrumb.jsx";
import TablePaginationButtons from "@/Components/TablePaginationButtons.jsx";

export default function TerminalTagged({
    auth,
    paginatedDocuments: { data: documents, ...paginate },
    filters,
}) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Terminal" />
            <div className="flex flex-col justify-start gap-8">
                <Breadcrumb
                    items={[
                        {
                            label: "Home",
                            href: route("dashboard"),
                        },
                        {
                            label: "Tagged as Terminal",
                        },
                    ]}
                />
                <DashboardHeader
                    heading="Documents Terminal"
                    text="Documents destined to your office."
                />
                <div className="flex flex-col gap-4 p-2">
                    {/*Table Filter*/}
                    <TerminalTableFilter filters={filters} />

                    {/*Data Table*/}
                    <TerminalTable documents={documents} />
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

function TerminalTable({ documents }) {
    return (
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
                {documents.map((document, index) => (
                    <TableRow key={index}>
                        <TableCell>{document.tracking_code}</TableCell>
                        <TableCell>{document.title}</TableCell>
                        <TableCell>{document.owner.name}</TableCell>
                        <TableCell>
                            {dayjs(document.terminated_at).format(
                                "MMMM DD, YYYY h:mm a ",
                            )}
                        </TableCell>
                        <TableCell>
                            <Button asChild variant="ghost" size="icon">
                                <Link
                                    href={route("documents.show", document.id)}
                                >
                                    <Icons.view className="h-4 w-4" />
                                </Link>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
