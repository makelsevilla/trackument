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
            title: "Documents",
            icon: "folder",
            subMenu: [
                {
                    title: "Pending for Action",
                    href: "/",
                    icon: "pending",
                },
                {
                    title: "Tagged as Terminal",
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
                    title: "Drafts",
                    href: route("draft.documents.index"),
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
