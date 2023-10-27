import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import DashboardHeader from "@/Components/DashboardHeader.jsx";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/Components/ui/table.jsx";
import { Label } from "@/Components/ui/label.jsx";
import { cn, ucwords } from "@/lib/utils.js";
import InputError from "@/Components/InputError.jsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select.jsx";
import Breadcrumb from "@/Components/Breadcrumb.jsx";
import { Textarea } from "@/Components/ui/textarea.jsx";
import { Button } from "@/Components/ui/button.jsx";
import DocumentFilesForm from "@/Pages/Document/DocumentFilesForm.jsx";

export default function ReceiveDocument({ auth, document }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="flex flex-col items-start gap-8">
                <Breadcrumb
                    items={[
                        {
                            href: route("documents.show", {
                                document: document.id,
                            }),
                            label: document.tracking_code,
                        },
                        {
                            label: "Release",
                        },
                    ]}
                />
                <DashboardHeader heading="Receive Document" />
                <div className="w-full">
                    <div className="max-w-xl px-2">{/*page content*/}</div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
