import MainNav from "@/Components/MainNav.jsx";
import { adminDashboardConfig } from "@/config/dashboard.js";
import UserAccountNav from "@/Components/UserAccountNav.jsx";
import DashboardNav from "@/Components/DashboardNav.jsx";
import { Toaster } from "@/Components/ui/toaster.jsx";
import { Button } from "@/Components/ui/button.jsx";
import { useEffect, useState } from "react";
import MobileSidebar from "@/Pages/Admin/MobileSidebar.jsx";
import Icons from "@/Components/Icons.jsx";
import { usePage } from "@inertiajs/react";
import { useToast } from "@/Components/ui/use-toast.js";

export default function AdminLayout({ user, children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { flash } = usePage().props;
    const { toast } = useToast();

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    useEffect(() => {
        if (flash?.message) {
            toast({
                description: flash.message,
                variant: flash?.status === "error" ? "destructive" : "",
                duration: 5000,
            });
        }
    }, [flash]);

    return (
        <div className="flex min-h-screen flex-col space-y-6">
            <header className="sticky top-0 z-40 border-b bg-background">
                <div className="container flex h-16 items-center justify-between py-4">
                    <div className="flex items-center">
                        {/*Sidebar*/}
                        <div className="mr-2 lg:hidden">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={toggleSidebar}
                            >
                                <Icons.sidebarTrigger className="h-6 w-6" />
                            </Button>
                            <MobileSidebar
                                toggleSidebar={toggleSidebar}
                                isOpen={isSidebarOpen}
                            >
                                <DashboardNav
                                    items={adminDashboardConfig.sidebarNav}
                                />
                            </MobileSidebar>
                        </div>

                        <MainNav url={route("admin.dashboard")} items={[]} />
                    </div>
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
            <div className="container grid flex-1 gap-6 lg:grid-cols-[250px_1fr]">
                <aside className="hidden w-[250px] flex-col lg:flex">
                    <DashboardNav items={adminDashboardConfig.sidebarNav} />
                </aside>
                <main className="flex w-full flex-1 flex-col overflow-auto">
                    {children}
                </main>
                <Toaster />
            </div>
        </div>
    );
}
