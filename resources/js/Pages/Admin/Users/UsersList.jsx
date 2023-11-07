import AdminLayout from "@/Layouts/AdminLayout.jsx";
import DashboardHeader from "@/Components/DashboardHeader.jsx";
import { Button } from "@/Components/ui/button.jsx";
import Icons from "@/Components/Icons.jsx";
import {
    TableHead,
    Table,
    TableHeader,
    TableRow,
    TableBody,
    TableCell,
} from "@/Components/ui/table.jsx";
import dayjs from "dayjs";

import Breadcrumb from "@/Components/Breadcrumb.jsx";
import { Link } from "@inertiajs/react";
import UserOperations from "@/Pages/Admin/Users/Components/UserOperations.jsx";
import TablePaginationButtons from "@/Components/TablePaginationButtons.jsx";
import { Input } from "@/Components/ui/input.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select.jsx";
import TableFilter from "@/Components/TableFilter.jsx";
import UsersListTableFilter from "@/Pages/Admin/Users/Components/UsersListTableFilter.jsx";

export default function UsersList({
    auth,
    paginatedUsers: { data: users, ...paginate },
}) {
    return (
        <AdminLayout user={auth.user}>
            <div className="flex flex-col justify-start gap-8">
                <Breadcrumb
                    items={[
                        {
                            label: "Home",
                            href: route("admin.dashboard"),
                        },
                        {
                            label: "User Management",
                        },
                    ]}
                />
                <DashboardHeader heading="Manage User Accounts">
                    <Button size="sm" asChild>
                        <Link href={route("admin.users.create")}>
                            <Icons.plus className="mr-2 h-4 w-4" />
                            Add User
                        </Link>
                    </Button>
                </DashboardHeader>

                {/*Content*/}
                <div className="flex flex-col gap-4 p-2">
                    {/*Table Filters*/}
                    <UsersListTableFilter />
                    {/*Table Dat*/}
                    <div>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-secondary">
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Date Created</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {user?.created_at &&
                                                dayjs(user.created_at).format(
                                                    "MMM D YYYY",
                                                )}
                                        </TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>
                                            <UserOperations user={user} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {users.length === 0 && (
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
        </AdminLayout>
    );
}