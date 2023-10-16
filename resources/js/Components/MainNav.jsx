import { useState } from "react";
import Icons from "@/Components/Icons.jsx";
import { siteConfig } from "@/config/site.js";
import { usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils.js";
import MobileNav from "@/Components/MobileNav.jsx";
import { Link } from "@inertiajs/react";

export default function MainNav({ items, children }) {
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const { ziggy } = usePage().props;
    const location = ziggy.location;
    const { pathname } = new URL(location);

    return (
        <div className="flex gap-6 md:gap-10">
            <Link href="/" className="hidden items-center space-x-2 md:flex">
                <Icons.logo />
                <span className="hidden text-lg font-bold sm:inline-block">
                    {siteConfig.name}
                </span>
            </Link>
            {items?.length ? (
                <nav className="hidden gap-6 md:flex">
                    {items?.map((item, index) => (
                        <Link
                            key={index}
                            href={item.disabled ? "#" : item.href}
                            className={cn(
                                "flex items-center text-lg font-medium transition-colors hover:text-foreground/80",
                                pathname === item.href || location === item.href
                                    ? "text-foreground"
                                    : "text-foreground/60",
                                item.disabled &&
                                    "cursor-not-allowed opacity-80",
                            )}
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>
            ) : null}
            <button
                className="flex items-center space-x-2 md:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
                {showMobileMenu ? <Icons.close /> : <Icons.logo />}
                <span className="font-bold">Menu</span>
            </button>
            {showMobileMenu && items && (
                <MobileNav items={items}>{children}</MobileNav>
            )}
        </div>
    );
}
