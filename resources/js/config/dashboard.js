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
            title: "Pending for action",
            href: "/dashboard",
            icon: "pending",
            subMenu: [
                {
                    title: "All Posts",
                    href: "/dashboard/posts",
                    icon: "post",
                },
            ],
        },
        {
            title: "My Documents",
            href: "/dashboard/billing",
            icon: "documents",
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
            title: "Received / Released",
            href: "/dashboard/settings",
            icon: "listChecks",
        },
        {
            title: "Tagged as terminal",
            href: "/dashboard/settings",
            icon: "terminal",
        },
    ],
};
