import { Label } from "@/Components/ui/label.jsx";
import { Input } from "@/Components/ui/input.jsx";
import InputError from "@/Components/InputError.jsx";
import InputHelper from "@/Components/InputHelper.jsx";
import { memo, useEffect, useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs.jsx";
import { Button } from "@/Components/ui/button.jsx";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible.jsx";
import Icons from "@/Components/Icons.jsx";
import { Card, CardContent } from "@/Components/ui/card.jsx";
import axios from "axios";
import { Progress } from "@/Components/ui/progress.jsx";
import { usePage } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table.jsx";

function DocumentFilesForm({
    role = "backup",
    documentId = null,
    withNameInput = false,
    ...props
}) {
    const [documentFiles, setDocumentFiles] = useState([]);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [fileLink, setFileLink] = useState("");
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const user = usePage().props.auth.user;

    const getDocumentFiles = () => {
        axios
            .get(
                route("document_files.index", {
                    document_id: documentId,
                    role: role,
                }),
            )
            .then((response) => setDocumentFiles(response.data))
            .catch((error) => console.log(error));
    };

    function resetData() {
        setFile(null);
        setFileName("");
        setFileLink("");
    }

    const handleSubmit = (type = "file") => {
        setProcessing(true);
        // resetting the errors object
        setErrors({});

        const data = {
            fileName: fileName,
            documentId: documentId,
            role: role,
            type: type,
        };

        if (data.type === "file") {
            data.file = file;
        } else {
            data.link = fileLink;
        }

        axios
            .post(
                route("document_files.store"),
                { ...data },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent) => {
                        let percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total,
                        );
                        setProgress(percentCompleted);
                    },
                },
            )
            .then((response) => {
                // console.log(response);
                resetData();
                getDocumentFiles();
            })
            .catch((error) => {
                console.log(error.response.data);
                if (error.response.status === 422) {
                    // console.log(error.response.data.errors);
                    setErrors(error.response.data.errors);
                }
            })
            .finally(() => setProcessing(false));
    };

    function handleFileDelete(fileId) {
        axios
            .delete(
                route("document_files.destroy", {
                    document_file: fileId,
                }),
            )
            .then((response) => {
                console.log(response);
                getDocumentFiles();
            })
            .catch((error) => console.log(error));
    }

    useEffect(() => {
        getDocumentFiles();
    }, []);

    return (
        <div {...props}>
            <div className="grid w-full gap-1.5">
                <Label>File Name</Label>
                {withNameInput && (
                    <div>
                        <Input
                            onChange={(e) => setFileName(e.target.value)}
                            value={fileName}
                        />
                        <InputError
                            message={errors.fileName}
                            className="mt-2"
                        />
                    </div>
                )}

                <Tabs className="mt-4" defaultValue="upload">
                    <TabsList>
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                        <TabsTrigger value="link">Link</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload">
                        <div className="flex items-center gap-2">
                            <Input
                                onChange={(e) => setFile(e.target.files[0])}
                                id="backup_file"
                                type="file"
                            />
                            <Button
                                disabled={processing}
                                variant="secondary"
                                size="sm"
                                onClick={() => handleSubmit("file")}
                            >
                                Upload
                            </Button>
                        </div>
                        <InputError message={errors.file} className="mt-2" />
                    </TabsContent>
                    <TabsContent value="link">
                        <div className="flex items-center gap-2">
                            <Input
                                value={fileLink}
                                onChange={(e) => setFileLink(e.target.value)}
                                placeholder="e.g https://www.example-site.com/"
                                type="text"
                            />
                            <Button
                                disabled={processing}
                                variant="secondary"
                                size="sm"
                                onClick={() => handleSubmit("link")}
                            >
                                Add
                            </Button>
                        </div>
                        <InputError message={errors.link} className="mt-2" />
                    </TabsContent>
                </Tabs>
                {processing && (
                    <div>
                        <Progress value={progress} />
                    </div>
                )}

                {documentFiles.length > 0 ? (
                    <Collapsible>
                        <div className="flex items-center space-x-4">
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    View Included Files
                                    <Icons.chevronsUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </CollapsibleTrigger>
                        </div>

                        <CollapsibleContent className="mt-2 space-y-2 px-2">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Uploaded By</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {documentFiles.map((file, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {file.file_name}
                                            </TableCell>
                                            <TableCell>
                                                {file.uploader_name}
                                            </TableCell>
                                            <TableCell>
                                                {file.uploaded_at}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <a
                                                            href={
                                                                file.file_type ===
                                                                "file"
                                                                    ? route(
                                                                          "file.download",
                                                                          {
                                                                              document_file:
                                                                                  file.id,
                                                                          },
                                                                      )
                                                                    : file.file_path
                                                            }
                                                            target="_blank"
                                                        >
                                                            <Icons.download className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                    {user.id ===
                                                        file.uploader_id && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:bg-destructive hover:text-destructive-foreground"
                                                        >
                                                            <Icons.trash
                                                                className="h-4 w-4"
                                                                onClick={() =>
                                                                    handleFileDelete(
                                                                        file.id,
                                                                    )
                                                                }
                                                            />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CollapsibleContent>
                    </Collapsible>
                ) : (
                    <div className="text-sm text-muted-foreground">
                        No Files Uploaded.
                    </div>
                )}

                <InputHelper>
                    <p>- Max 10 MB file size.</p>
                    <p>
                        - You can upload larger files via{" "}
                        <a
                            className="underline"
                            href="https://www.google.com/drive/"
                            target="_blank"
                        >
                            Google Drive
                        </a>{" "}
                        or any other cloud storage provider and then add the url
                        in the URL tab.
                    </p>
                    <p>- Include https://www. or http://www. in the URL.</p>
                </InputHelper>
            </div>
        </div>
    );
}

export default memo(DocumentFilesForm);
