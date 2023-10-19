import { cn } from "@/lib/utils.js";

export default function InputHelper({ children, className, ...props }) {
    return (
        <div
            {...props}
            className={cn(
                "mt-2 text-sm text-gray-500 dark:text-gray-400",
                className,
            )}
        >
            {children}
        </div>
    );
}
