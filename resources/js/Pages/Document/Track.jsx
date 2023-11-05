import { Head } from "@inertiajs/react";
import DashboardHeader from "@/Components/DashboardHeader.jsx";

export default function Track({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Track" />
            <div className="grid items-start gap-8">
                <DashboardHeader heading="Track Document" />
                <div className="px-2"></div>
            </div>
        </AuthenticatedLayout>
    );
}
