import AdminLayout from "@/Layouts/AdminLayout.jsx";
import DashboardHeader from "@/Components/DashboardHeader.jsx";
import { Button } from "@/Components/ui/button.jsx";
import Icons from "@/Components/Icons.jsx";
import Breadcrumb from "@/Components/Breadcrumb.jsx";

export default function EditUser({ auth, user }) {
    return (
        <AdminLayout user={auth.user}>
            <div className="flex flex-col justify-start gap-8">
                <Breadcrumb
                    items={[
                        {
                            label: "Home",
                            href: route("admin.dashboard"),
                        },
                        {
                            label: "User Management",
                            href: route("admin.users.index"),
                        },
                        {
                            label: "Edit",
                        },
                    ]}
                />
                <DashboardHeader heading="Edit User User" />
                {/*Content*/}
                <div className="flex">Edit User</div>
            </div>
        </AdminLayout>
    );
}
