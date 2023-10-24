import Authenticated from "@/Layouts/AuthenticatedLayout.jsx";
import DashboardHeader from "@/Components/DashboardHeader.jsx";
import { Button } from "@/Components/ui/button.jsx";
import { Link } from "@inertiajs/react";

export default function UserDraftDocuments({ auth }) {
    return (
        <Authenticated>
            <DashboardHeader title="My Documents" />
            <div className="py-12">
                <h1>Draft Documents</h1>
                <Button asChild>
                    <Link
                        as="button"
                        method="post"
                        href={route("documents.store")}
                    >
                        Add Document
                    </Link>
                </Button>
            </div>
        </Authenticated>
    );
}
