import { Link, usePage } from "@inertiajs/react";
import Icons from "@/Components/Icons.jsx";
import { cn } from "@/lib/utils.js";
import { Badge } from "@/Components/ui/badge.jsx";

export default function DashboardNav({ items }) {
    const { ziggy, navBadges = [] } = usePage().props;
    const location = ziggy.location;
    const { pathname } = new URL(location);

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
                                                {navBadges[subItem?.id] && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="absolute right-1"
                                                    >
                                                        {navBadges[subItem.id]}
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
                                {navBadges[item?.id] && (
                                    <Badge
                                        variant="secondary"
                                        className="absolute right-1"
                                    >
                                        {navBadges[item.id]}
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
