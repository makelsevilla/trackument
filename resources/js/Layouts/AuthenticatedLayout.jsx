import { useEffect, useState } from "react";
import { dashboardConfig } from "@/config/dashboard.js";
import MainNav from "@/Components/MainNav.jsx";
import UserAccountNav from "@/Components/UserAccountNav.jsx";
import DashboardNav from "@/Components/DashboardNav.jsx";
import { Toaster } from "@/Components/ui/toaster.jsx";
import { usePage } from "@inertiajs/react";
import { useToast } from "@/Components/ui/use-toast.js";
import { Input } from "@/Components/ui/input.jsx";
import { Button } from "@/Components/ui/button.jsx";
import NavTrackingForm from "@/Components/NavTrackingForm.jsx";
import Icons from "@/Components/Icons.jsx";
import MobileSidebar from "@/Pages/Admin/MobileSidebar.jsx";

export default function Authenticated({
    user,
    header,
    children,
    withSidebar = true,
}) {
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
                        {withSidebar && (
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
                                        items={dashboardConfig.sidebarNav}
                                    />
                                </MobileSidebar>
                            </div>
                        )}

                        <MainNav items={[]} />

                        <div className="px-4">
                            <NavTrackingForm />
                        </div>
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

            {withSidebar ? (
                <div className="container grid flex-1 gap-12 lg:grid-cols-[250px_1fr]">
                    <aside className="hidden w-[250px] flex-col lg:flex">
                        <DashboardNav items={dashboardConfig.sidebarNav} />
                    </aside>
                    <main className="flex w-full flex-1 flex-col overflow-hidden">
                        {children}
                    </main>
                    <Toaster />
                </div>
            ) : (
                <div className="container flex-1">
                    <main className="flex w-full flex-1 flex-col overflow-hidden">
                        {children}
                    </main>
                    <Toaster />
                </div>
            )}

            {/*<div className="border-t"> Footer </div>*/}
        </div>
    );
}
