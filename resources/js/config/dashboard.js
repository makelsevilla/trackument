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
            href: route("notifications.index"),
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
            title: "Transfers",
            href: route("admin.document-transfers.index"),
            icon: "transfer",
            segment: "/admin/document-transfers",
        },
        {
            title: "Users",
            icon: "users",
            subMenu: [
                {
                    title: "Active",
                    icon: "userCheck",
                    href: route("admin.users.index"),
                },
                {
                    title: "Deleted",
                    icon: "userX",
                    href: route("admin.users.index"),
                },
            ],
        },
        {
            title: "Documents",
            href: route("admin.documents.index"),
            icon: "documents",
            segment: "/admin/documents",
        },
        {
            title: "Configurations",
            icon: "folderCog",
            subMenu: [
                {
                    title: "Types",
                    href: route("admin.document-types.index"),
                    icon: "fileType",
                    segment: "/admin/document-types",
                },
                {
                    title: "Purposes",
                    href: route("admin.document-purposes.index"),
                    segment: "/admin/document-purposes",
                },
                {
                    title: "Release Actions",
                    href: route("admin.document-release-actions.index"),
                    segment: "/admin/document-release-actions",
                },
            ],
        },
    ],
};
