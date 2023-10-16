import { Link, usePage } from "@inertiajs/react";
import Icons from "@/Components/Icons.jsx";
import { cn } from "@/lib/utils.js";

export default function DashboardNav({ items }) {
    const { ziggy } = usePage().props;
    const location = ziggy.location;
    const { pathname } = new URL(location);

    if (!items?.length) {
        return null;
    }
    return (
        <nav className="grid items-start gap-2">
            {items.map((item, index) => {
                const Icon = Icons[item.icon] || Icons["arrowRight"];

                return (
                    item.href && (
                        <Link
                            key={index}
                            href={item.disabled ? "#" : item.href}
                        >
                            <span
                                className={cn(
                                    "group flex items-center rounded-md px-3 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground",
                                    pathname === item.href ||
                                        location === item.href
                                        ? "bg-accent"
                                        : "bg-transparent",
                                    item.disabled &&
                                        "cursor-not-allowed opacity-80",
                                )}
                            >
                                <Icon className="mr-2 h-5 w-5" />
                                <span>{item.title}</span>
                            </span>
                        </Link>
                    )
                );
            })}
        </nav>
    );
}
