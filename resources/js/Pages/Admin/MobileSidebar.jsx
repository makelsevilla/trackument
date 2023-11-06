import { Sheet, SheetContent } from "@/Components/ui/sheet.jsx";
import { dashboardConfig } from "@/config/dashboard.js";
import DashboardNav from "@/Components/DashboardNav.jsx";

export default function MobileSidebar({ isOpen, toggleSidebar, children }) {
    return (
        <Sheet open={isOpen} onOpenChange={toggleSidebar}>
            <SheetContent side="left">
                <div className="mt-8">{children}</div>
            </SheetContent>
        </Sheet>
    );
}
