export const dashboardConfig = {
    mainNav: [
        {
            title: "Track Document",
            href: "/docs",
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
            title: "Quick Actions",
            href: "/",
            icon: "activity",
        },
        {
            title: "My Documents",
            icon: "myDocuments",
            subMenu: [
                {
                    title: "Draft",
                    href: route("documents.lists.drafts"),
                    icon: "draft",
                },
                {
                    title: "Finalized",
                    href: route("documents.lists.finalized"),
                    icon: "finalized",
                },
            ],
        },
        {
            title: "Documents",
            icon: "folder",
            subMenu: [
                {
                    title: "Requiring Action",
                    href: route("documents.lists.actionable"),
                    icon: "action",
                },
                {
                    id: "incoming",
                    title: "Incoming",
                    href: route("documents.lists.incoming"),
                    icon: "incoming",
                },
                {
                    id: "outgoing",
                    title: "Outoing",
                    href: "/dashboard/settings",
                    icon: "outgoing",
                },

                {
                    title: "Transfer Logs",
                    href: "/dashboard/settings",
                    icon: "listChecks",
                },
                {
                    title: "Tagged as Terminal",
                    href: "/dashboard/settings",
                    icon: "terminal",
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
