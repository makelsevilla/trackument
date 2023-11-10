import { Link, usePage } from "@inertiajs/react";
import Icons from "@/Components/Icons.jsx";
import { cn } from "@/lib/utils.js";
import { Badge } from "@/Components/ui/badge.jsx";
import { useEffect, useState } from "react";
import { useToast } from "@/Components/ui/use-toast.js";

export default function DashboardNav({ items }) {
    const [badgeCounts, setBadgeCounts] = useState({});
    const { ziggy, navBadges = [] } = usePage().props;
    const { toast } = useToast();

    const location = ziggy.location;
    const { pathname } = new URL(location);

    useEffect(() => {
        // getting the initial values
        fetchBadgeCounts().then((badgeCounts) => {
            setBadgeCounts(badgeCounts);
        });
    }, []);

    useEffect(() => {
        if (!badgeCounts) {
            return; // Wait for initial badge counts before starting the polling
        }

        // Poll every 10 seconds (adjust as needed)
        const intervalId = setInterval(async () => {
            const newBadgeCounts = await fetchBadgeCounts();

            if (!isEqual(badgeCounts, newBadgeCounts)) {
                setBadgeCounts(newBadgeCounts);

                // identify if the new badge count is greater than the old badge count
                // if so, show a toast
                Object.keys(newBadgeCounts).forEach((key) => {
                    if (newBadgeCounts[key] > badgeCounts[key]) {
                        // get the difference between the old and new badge count
                        const difference =
                            newBadgeCounts[key] - badgeCounts[key];

                        const keyMessage = {
                            incoming: "incoming document/s.",
                            notifications: "notifications.",
                        };

                        toast({
                            title: `You have ${difference} new ${
                                keyMessage?.[key] || key
                            }`,
                        });
                    }
                });
            }
        }, 2000);

        return () => {
            clearInterval(intervalId);
        };
    }, [badgeCounts]);

    const fetchBadgeCounts = async () => {
        try {
            const response = await axios.get(route("badgeCounts"));
            return response.data;
        } catch (error) {
            console.error("Error fetching badge counts:", error);
        }
    };

    const isEqual = (obj1, obj2) =>
        JSON.stringify(obj1) === JSON.stringify(obj2);

    const badgeDisplayText = {
        incoming: badgeCounts["incoming"] ? badgeCounts["incoming"] : 0,
        notifications: badgeCounts["notifications"]
            ? `${badgeCounts["notifications"]} new`
            : 0,
    };

    if (!items?.length) {
        return null;
    }
    return (
        <nav className="grid items-start gap-2">
            {items.map((item, index) => {
                const Icon = Icons[item.icon] || Icons["arrowRight"];

                return item.subMenu ? (
                    <div key={index}>
                        <div
                            className={cn(
                                "group flex items-center rounded-md px-3 py-2 text-lg font-medium",
                            )}
                        >
                            <Icon className="mr-2 h-5 w-5" />
                            <span>{item.title}</span>
                        </div>
                        <div className="ml-6">
                            {item.subMenu.map((subItem, subIndex) => {
                                const SubIcon =
                                    Icons[subItem.icon] || Icons["arrowRight"];

                                return (
                                    subItem.href && (
                                        <Link
                                            key={subIndex}
                                            href={
                                                subItem.disabled
                                                    ? "#"
                                                    : subItem.href
                                            }
                                        >
                                            <span
                                                className={cn(
                                                    "group relative flex items-center rounded-md px-3 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground",
                                                    pathname === subItem.href ||
                                                        location ===
                                                            subItem.href ||
                                                        pathname.startsWith(
                                                            subItem?.segment,
                                                        )
                                                        ? "bg-accent"
                                                        : "bg-transparent",
                                                    subItem.disabled &&
                                                        "cursor-not-allowed opacity-80",
                                                )}
                                            >
                                                <SubIcon className="mr-2 h-5 w-5" />
                                                <span>{subItem.title}</span>
                                                {subItem?.id && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="absolute right-1"
                                                    >
                                                        {badgeDisplayText[
                                                            subItem.id
                                                        ] || 0}
                                                    </Badge>
                                                )}
                                            </span>
                                        </Link>
                                    )
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    item.href && (
                        <Link
                            key={index}
                            href={item.disabled ? "#" : item.href}
                        >
                            <span
                                className={cn(
                                    "group relative flex items-center rounded-md px-3 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground",
                                    pathname === item.href ||
                                        location === item.href ||
                                        pathname.startsWith(item?.segment)
                                        ? "bg-accent"
                                        : "bg-transparent",
                                    item.disabled &&
                                        "cursor-not-allowed opacity-80",
                                )}
                            >
                                <Icon className="mr-2 h-5 w-5" />
                                <span>{item.title}</span>
                                {item?.id && (
                                    <Badge
                                        variant="secondary"
                                        className="absolute right-1"
                                    >
                                        {badgeDisplayText[item.id] || 0}
                                    </Badge>
                                )}
                            </span>
                        </Link>
                    )
                );
            })}
        </nav>
    );
}
