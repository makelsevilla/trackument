import Authenticated from "@/Layouts/AuthenticatedLayout.jsx";
import DashboardHeader from "@/Components/DashboardHeader.jsx";

export default function UserDocuments({ auth }) {
    return (
        <Authenticated>
            <DashboardHeader title="My Documents" />
            <div className="py-12">
                <h1>Hakdog</h1>
            </div>
        </Authenticated>
    );
}
