import { Card, CardContent } from "@/Components/ui/card.jsx";
import Icons from "@/Components/Icons.jsx";
import dayjs from "dayjs";
import { Button } from "@/Components/ui/button.jsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu.jsx";

export default function DocumentFileCard({
    file,
    withDeleteButton = false,
    handleFileDelete = null,
    ...props
}) {
    return (
        <Card {...props}>
            <CardContent className="relative p-4">
                <div>
                    <div className="flex items-center">
                        <div className="rounded-md border px-4 py-2">
                            <Icons.file className="h-6 w-6 " />
                            <p className="text-sm capitalize italic text-muted-foreground">
                                {file.file_type}
                            </p>
                        </div>
                        <div className="ml-4">
                            <p className=" text-sm">
                                {file.uploaded_at &&
                                    dayjs(file.uploaded_at).format(
                                        "MMMM DD, YYYY hh:mm A",
                                    )}
                            </p>
                            <p className="text-sm">
                                Uploader: {file.uploader_name}
                            </p>
                        </div>
                        <div className="ml-auto">
                            <Button variant="ghost" size="icon" asChild>
                                <a
                                    href={
                                        file.file_type === "file"
                                            ? route("file.download", {
                                                  document_file: file.id,
                                              })
                                            : file.file_path
                                    }
                                    target="_blank"
                                >
                                    <Icons.download className="h-4 w-4" />
                                </a>
                            </Button>
                            {withDeleteButton && (
                                <Button
                                    onClick={() => handleFileDelete(file.id)}
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-destructive hover:text-destructive-foreground"
                                >
                                    <Icons.trash className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="overflow-auto break-words">
                        <p className="mt-2 px-4 font-medium ">
                            {file.file_name}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
