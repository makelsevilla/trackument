import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils.js";

export default function Breadcrumb({ items, className, ...props }) {
    return (
        <nav
            {...props}
            className={cn("flex w-max", className)}
            aria-label="Breadcrumb"
        >
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                {items.map((item, index) => (
                    <li key={index} className="inline-flex items-center">
                        {/* prints the seperation arrow */}
                        {index > 0 && (
                            <div className="flex items-center">
                                <svg
                                    className="mx-1 h-3 w-3 text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="m1 9 4-4-4-4"
                                    />
                                </svg>
                            </div>
                        )}
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
