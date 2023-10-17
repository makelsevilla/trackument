export const dashboardConfig = {
    mainNav: [
        {
            title: "Documentation",
            href: "/docs",
        },
        {
            title: "Support",
            href: "/support",
            disabled: true,
        },
    ],
    // Give a nav-item an id if it expects a badge
    sidebarNav: [
        {
            title: "Dashboard",
            href: route("dashboard"),
            icon: "dashboard",
        },
        {
            title: "Documents",
            icon: "folder",
            subMenu: [
                {
                    title: "Pending for action",
                    href: "/",
                    icon: "pending",
                },
                {
                    title: "Tagged as terminal",
                    href: "/dashboard/settings",
                    icon: "terminal",
                },

                {
                    id: "incoming",
                    title: "Incoming",
                    href: "/dashboard/settings",
                    icon: "incoming",
                },
                {
                    id: "outgoing",
                    title: "Outoing",
                    href: "/dashboard/settings",
                    icon: "outgoing",
                },
                {
                    title: "My Documents",
                    href: "/dashboard/billing",
                    icon: "documents",
                },
                {
                    title: "Received / Released",
                    href: "/dashboard/settings",
                    icon: "listChecks",
                },
            ],
        },
        {
            id: "notifications",
            title: "Notifications",
            href: "/",
            icon: "notification",
        },
    ],
};
