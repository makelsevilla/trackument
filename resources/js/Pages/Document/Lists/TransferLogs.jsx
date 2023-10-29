import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head } from "@inertiajs/react";
import DashboardHeader from "@/Components/DashboardHeader.jsx";

export default function TransferLogs({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Incoming" />
            <div className="grid items-start gap-8">
                <DashboardHeader
                    heading="Incoming Documents"
                    text="Documents released by other offices."
                />
                <div className="px-2">Page Content Here</div>
            </div>
        </AuthenticatedLayout>
    );
}
