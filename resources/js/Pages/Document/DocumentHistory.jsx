import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head } from "@inertiajs/react";
import DashboardHeader from "@/Components/DashboardHeader.jsx";
import dayjs from "dayjs";

export default function DocumentHistory({ auth, documentHistory }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Timeline" />
            <div className="grid items-start gap-8">
                <DashboardHeader heading="Timeline" />
                <div className="px-2">
                    {!documentHistory && (
                        <div className="text-muted-foreground">
                            Enter a valid tracking number to show the timeline.
                        </div>
                    )}
                    <ol className="relative border-l border-gray-200 dark:border-gray-700">
                        {documentHistory?.map((history, index) => (
                            <li key={index} className="mb-10 ml-4">
                                <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
                                <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                                    {history.created_at &&
                                        dayjs(history.created_at).format(
                                            "MMMM DD, YYYY h:mm a",
                                        )}
                                </time>
                                <h3 className="text-lg font-semibold uppercase text-gray-900 dark:text-white">
                                    {history.action}{" "}
                                    <span className="ml-4 text-sm text-muted-foreground">
                                        By: {" " + history.actor_name}
                                    </span>
                                </h3>
                                <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                                    {history.details}
                                </p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}