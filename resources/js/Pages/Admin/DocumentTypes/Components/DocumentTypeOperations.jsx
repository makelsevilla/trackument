import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu.jsx";
import { Button } from "@/Components/ui/button.jsx";
import Icons from "@/Components/Icons.jsx";
import { Link, useForm } from "@inertiajs/react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
} from "@/Components/ui/alert-dialog.jsx";
import { useState } from "react";

export default function DocumentTypeOperations({ dt }) {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const { processing, delete: destroy } = useForm();

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <Icons.moreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={route("admin.document-types.edit", dt.id)}>
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={() => setShowDeleteAlert(true)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog
                open={showDeleteAlert}
                onOpenChange={setShowDeleteAlert}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        Are you sure you want to delete this document type?
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() =>
                                destroy(
                                    route("admin.document-types.destroy", {
                                        documentType: dt.id,
                                    }),
                                )
                            }
                            className="bg-red-600 focus:ring-red-600"
                            disabled={processing}
                        >
                            <span>Delete</span>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
