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

function DocumentFilesForm({
    role = "backup",
    documentId = null,
    withNameInput = false,
    ...props
}) {
    const [draftDocumentFiles, setDraftDocumentFiles] = useState(null);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [fileLink, setFileLink] = useState("");
    const [errors, setErrors] = useState({});

    const getDraftDocumentFiles = () => {
        axios
            .get(
                route("draft.document_files.index", {
                    document_id: documentId,
                    role: role,
                }),
            )
            .then((response) => setDraftDocumentFiles(response.data))
            .catch((error) => console.log(error));
    };

    function resetData() {
        setFile(null);
        setFileName("");
        setFileLink("");
    }

    const handleSubmit = (type = "file") => {
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
                route("draft.document_files.store"),
                { ...data },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            )
            .then((response) => {
                // console.log(response);
                resetData();
                getDraftDocumentFiles();
            })
            .catch((error) => {
                console.log(error.response.data);
                if (error.response.status === 422) {
                    // console.log(error.response.data.errors);
                    setErrors(error.response.data.errors);
                }
            });
    };

    function handleFileDelete(fileId) {
        axios
            .delete(
                route("draft.document_files.destroy", {
                    document_file: fileId,
                }),
            )
            .then((response) => {
                console.log(response);
                getDraftDocumentFiles();
            })
            .catch((error) => console.log(error));
    }

    useEffect(() => {
        getDraftDocumentFiles();
    }, []);

    console.log(draftDocumentFiles);
    return (
        <div {...props}>
            <div className="grid w-full gap-1.5">
                <Label>File Backup</Label>
                {withNameInput && (
                    <div>
                        <Input
                            onChange={(e) => setFileName(e.target.value)}
                            value={fileName}
                            placeholder="File Name"
                        />
                        <InputError
                            message={errors.fileName}
                            className="mt-2"
                        />
                    </div>
                )}

                <Tabs defaultValue="upload">
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

                {draftDocumentFiles && (
                    <Collapsible>
                        <div className="flex items-center space-x-4">
                            <Label>Backup Files</Label>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost">
                                    <Icons.chevronsUpDown className="h-4 w-4" />
                                </Button>
                            </CollapsibleTrigger>
                        </div>

                        <CollapsibleContent className="space-y-2 px-2">
                            {draftDocumentFiles.map((file, index) => (
                                <div className="flex items-center gap-2">
                                    <a
                                        href={file.file_path}
                                        target="_blank"
                                        key={index}
                                        className="flex flex-1 items-center justify-between gap-4 rounded-md border px-4 py-2 shadow-sm hover:shadow-md"
                                    >
                                        <div>{file.file_name}</div>
                                        <div>{file.uploader_name}</div>
                                        <div>{file.uploaded_at}</div>
                                    </a>
                                    <Button
                                        onClick={() =>
                                            handleFileDelete(file.id)
                                        }
                                        variant="ghost"
                                        size="icon"
                                        className="hover:bg-destructive hover:text-destructive-foreground"
                                    >
                                        <Icons.trash className="h-4 w-4" />
                                        {file.id}
                                    </Button>
                                </div>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
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
