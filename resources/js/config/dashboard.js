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
                    title: "Incoming",
                    href: "/dashboard/settings",
                    icon: "incoming",
                },
                {
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
    ],
};
