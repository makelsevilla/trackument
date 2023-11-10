import { Head, Link } from "@inertiajs/react";
import Breadcrumb from "@/Components/Breadcrumb.jsx";
import DashboardHeader from "@/Components/DashboardHeader.jsx";
import { Button } from "@/Components/ui/button.jsx";
import Authenticated from "@/Layouts/AuthenticatedLayout.jsx";
import PaginationButtons from "@/Pages/Document/Lists/Components/PaginationButtons.jsx";
import TablePaginationButtons from "@/Components/TablePaginationButtons.jsx";
import Icons from "@/Components/Icons.jsx";
import { cn } from "@/lib/utils.js";

export default function Notifications({
    auth,
    paginatedNotifications: { data: notifications, ...paginate },
}) {
    return (
        <Authenticated user={auth.user}>
            <Head title="Notifications" />
            <div className="flex flex-col justify-start gap-8">
                <Breadcrumb
                    items={[
                        {
                            label: "Home",
                            href: route("dashboard"),
                        },
                        {
                            label: "Notifications",
                        },
                    ]}
                />
                <DashboardHeader heading="Notifications" />

                {/*Content*/}
                <div className="flex flex-col gap-4 p-2">
                    <div className="flex justify-end">
                        <Button variant="ghost" asChild>
                            <Link
                                href={route("notifications.markAllAsRead")}
                                method="patch"
                                as="button"
                            >
                                Mark all as read
                            </Link>
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {notifications.map((notification, idx) => {
                            return (
                                <div
                                    className={cn(
                                        "group relative rounded border p-4 shadow hover:bg-secondary",
                                        {
                                            "bg-slate-50":
                                                !notification.is_read,
                                        },
                                    )}
                                    key={idx}
                                >
                                    <p>{notification.created_at}</p>
                                    <p className="font-medium">
                                        {notification?.message}
                                    </p>
                                    <div className="invisible absolute right-2 top-2 group-hover:visible">
                                        <Button
                                            variant="ghost"
                                            className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                            asChild
                                        >
                                            <Link
                                                href={route(
                                                    "notifications.destroy",
                                                )}
                                                data={{
                                                    notificationId:
                                                        notification.id,
                                                }}
                                                method="delete"
                                                as="button"
                                            >
                                                <Icons.trash className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                    <div className="absolute bottom-0 right-4">
                                        {notification.is_read ? (
                                            ""
                                        ) : (
                                            <Button
                                                className="p-0"
                                                variant="link"
                                                asChild
                                            >
                                                <Link
                                                    href={route(
                                                        "notifications.markAsRead",
                                                    )}
                                                    data={{
                                                        notificationId:
                                                            notification.id,
                                                    }}
                                                    method="patch"
                                                    as="button"
                                                >
                                                    Mark as read
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <Button
                            variant="secondary"
                            size="icon"
                            disabled={paginate.current_page === 1}
                            asChild={paginate.current_page !== 1}
                        >
                            <Link href={paginate.prev_page_url}>
                                <Icons.chevronLeft className="h-4 w-4" />
                            </Link>
                        </Button>

                        <Button
                            variant="secondary"
                            size="icon"
                            disabled={
                                paginate.current_page === paginate.last_page
                            }
                            asChild={
                                paginate.current_page !== paginate.last_page
                            }
                        >
                            <Link href={paginate.next_page_url}>
                                <Icons.chevronRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}

function NotificationActions() {}
