import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head } from "@inertiajs/react";
import DashboardHeader from "@/Components/DashboardHeader.jsx";
import dayjs from "dayjs";
import Breadcrumb from "@/Components/Breadcrumb.jsx";
import { cn } from "@/lib/utils.js";
import { ScrollArea } from "@/Components/ui/scroll-area.jsx";

export default function DocumentHistory({
    auth,
    documentHistory,
    trackingCode,
}) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Timeline" />
            <div className="flex h-screen flex-col justify-start gap-8">
                <Breadcrumb
                    items={[
                        {
                            label: "Home",
                            href: route("dashboard"),
                        },
                        {
                            label: "Tracking ",
                        },
                    ]}
                />
                <DashboardHeader
                    heading={`Document ${
                        documentHistory ? trackingCode : ""
                    } Audit Trail`}
                />
                <div className="overflow-auto rounded-lg border p-4 shadow-xl">
                    {!documentHistory && (
                        <div className="text-muted-foreground">
                            Enter a valid tracking number to show the timeline.
                        </div>
                    )}
                    <ol className="relative mx-2 border-l border-gray-200 dark:border-gray-700">
                        {documentHistory?.length === 0 && (
                            <div className="text-muted-foreground">
                                No history found.
                            </div>
                        )}
                        {documentHistory?.map((history, index) => {
                            const isFirst = index === 0;

                            return (
                                <li key={index} className="mb-10 ml-4">
                                    <div
                                        className={cn(
                                            "absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700",
                                            {
                                                "bg-blue-500": isFirst,
                                                "animate-pulse": isFirst,
                                            },
                                        )}
                                    ></div>
                                    <time
                                        className={cn(
                                            "mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500",
                                            { "text-blue-500": isFirst },
                                        )}
                                    >
                                        {history.created_at &&
                                            dayjs(history.created_at).format(
                                                "MMMM DD, YYYY h:mm a",
                                            )}
                                    </time>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        <span className="capitalize">
                                            {history?.action}
                                        </span>
                                        <span className="ml-4 text-sm text-muted-foreground">
                                            By:{" "}
                                            <span className="capitalize">
                                                {history.actor_name}
                                            </span>
                                        </span>
                                    </h3>
                                    <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                                        {history.details}
                                    </p>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
