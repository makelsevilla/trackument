export const dashboardConfig = {
    mainNav: [
        /*  {
            title: "Track Document",
            href: "/docs",
        },*/
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
            title: "Documents",
            icon: "folderOpen",
            subMenu: [
                {
                    title: "My Documents",
                    href: route("documents.lists.finalized"),
                    icon: "myDocuments",
                },

                {
                    title: "Tagged as Terminal",
                    href: route("documents.lists.terminal"),
                    icon: "terminal",
                },
                {
                    title: "Draft",
                    href: route("documents.lists.drafts"),
                    icon: "draft",
                },
            ],
        },
        {
            title: "Document Transfer",
            icon: "transfer",
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
                    title: "Outgoing",
                    href: route("documents.lists.outgoing"),
                    icon: "outgoing",
                },

                {
                    title: "Logs",
                    href: route("documents.lists.transfers"),
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

export const adminDashboardConfig = {
    mainNav: [
        /*  {
            title: "Track Document",
            href: "/docs",
        },*/
    ],
    // Give a nav-item an id if it expects a badge
    sidebarNav: [
        {
            title: "Dashboard",
            href: route("admin.dashboard"),
            icon: "dashboard",
        },
        {
            title: "User Management",
            href: route("admin.users.index"),
            icon: "userCog",
            segment: "/admin/users",
        },
    ],
};
