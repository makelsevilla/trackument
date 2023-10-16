import { useState } from "react";
import { dashboardConfig } from "@/config/dashboard.js";
import MainNav from "@/Components/MainNav.jsx";
import UserAccountNav from "@/Components/UserAccountNav.jsx";
import DashboardNav from "@/Components/DashboardNav.jsx";

export default function Authenticated({ user, header, children }) {
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <div className="flex min-h-screen flex-col space-y-6">
            <header className="sticky top-0 z-40 border-b bg-background">
                <div className="container flex h-16 items-center justify-between py-4">
                    <MainNav items={dashboardConfig.mainNav} />
                    <div>
                        <UserAccountNav
                            user={{
                                name: user?.name,
                                image: user?.image,
                                email: user?.email,
                            }}
                        />
                    </div>
                </div>
            </header>
            <div className="container grid flex-1 gap-12 md:grid-cols-[250px_1fr]">
                <aside className="hidden w-[250px] flex-col md:flex">
                    <DashboardNav items={dashboardConfig.sidebarNav} />
                </aside>
                <main className="flex w-full flex-1 flex-col overflow-hidden">
                    {children}
                </main>
            </div>
            {/*<div className="border-t"> Footer </div>*/}
        </div>
    );
}
