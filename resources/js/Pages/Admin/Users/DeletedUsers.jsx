import AdminLayout from "@/Layouts/AdminLayout.jsx";
import Breadcrumb from "@/Components/Breadcrumb.jsx";
import DashboardHeader from "@/Components/DashboardHeader.jsx";
import UsersListTableFilter from "@/Pages/Admin/Users/Components/UsersListTableFilter.jsx";
import TablePaginationButtons from "@/Components/TablePaginationButtons.jsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table.jsx";
import dayjs from "dayjs";
import { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu.jsx";
import { Button } from "@/Components/ui/button.jsx";
import Icons from "@/Components/Icons.jsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
} from "@/Components/ui/alert-dialog.jsx";

export default function DeletedUsers({
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
                            label: "Deleted Users",
                        },
                    ]}
                />
                <DashboardHeader heading="Deleted User Accounts" />

                {/*Content*/}
                <div className="flex flex-col gap-4 p-2">
                    {/*Table Filters*/}
                    <UsersListTableFilter routeName="admin.users.deleted" />

                    {/*Table Data*/}
                    <UsersTable users={users} />
                    <div>
                        {users.length === 0 && (
                            <div className="text-center text-muted-foreground">
                                No Data Found
                            </div>
                        )}
                    </div>

                    {/*Table Footer*/}
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

function UsersTable({ users }) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-secondary">
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Date Deleted</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user, idx) => (
                    <TableRow key={idx}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>
                            {user?.deleted_at &&
                                dayjs(user.created_at).format("MMM D YYYY")}
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                            <UserOperations user={user} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function UserOperations({ user }) {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const { processing, delete: destroy } = useForm();

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
                            className="w-full"
                            href={route("admin.users.restore", user.id)}
                            method="post"
                            as="button"
                        >
                            Restore
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={() => setShowDeleteAlert(true)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                    >
                        Delete Permanently
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog
                open={showDeleteAlert}
                onOpenChange={setShowDeleteAlert}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        Are you sure you want to permanently delete this user?
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() =>
                                destroy(
                                    route("admin.users.destroy", {
                                        user: user.id,
                                    }),
                                )
                            }
                            className="bg-red-600 focus:ring-red-600"
                            disabled={processing}
                        >
                            <span>Delete Permanently</span>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
