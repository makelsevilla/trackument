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
import axios from "axios";
import { Progress } from "@/Components/ui/progress.jsx";
import { usePage } from "@inertiajs/react";
import { hyphen_uc_words } from "@/lib/utils.js";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select.jsx";
import DocumentFileCard from "@/Components/DocumentFileCard.jsx";
import { useToast } from "@/Components/ui/use-toast.js";

function DocumentFilesForm({
    documentId = null,
    withNameInput = false,
    ...props
}) {
    const [role, setRole] = useState("");
    const [documentFiles, setDocumentFiles] = useState([]);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [fileLink, setFileLink] = useState("");
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const user = usePage().props.auth.user;

    const { toast } = useToast();

    const showToast = (message, type = "default") => {
        toast({
            title: message,
            type: type,
            duration: 5000,
        });
    };

    const getDocumentFiles = () => {
        axios
            .get(
                route("document_files.index", {
                    document_id: documentId,
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
                showToast(response.data.message || "File added successfully.");
            })
            .catch((error) => {
                if (error.response.status === 422) {
                    // console.log(error.response.data.errors);
                    setErrors(error.response.data.errors);
                }

                showToast(
                    error.response.data.message || "Something went wrong.",
                    "destructive",
                );
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
                showToast(
                    response.data.message || "File deleted successfully.",
                );
                getDocumentFiles();
            })
            .catch((error) => {
                showToast(
                    error.response.data.message || "Something went wrong.",
                    "destructive",
                );
            });
    }

    useEffect(() => {
        getDocumentFiles();
    }, []);

    return (
        <div {...props}>
            <div className="grid w-full gap-2">
                <div className="grid gap-1.5">
                    <Label>File Role</Label>
                    <Select
                        value={role}
                        onValueChange={(value) => setRole(value)}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="backup">Backup</SelectItem>
                                <SelectItem value="attachment">
                                    Attachment
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.role} />
                    <InputHelper>
                        <p>
                            - <span className="font-bold italic">Backup</span>{" "}
                            file role are files that is the exactly the same
                            with the document hard copy.
                        </p>
                        <p>
                            -{" "}
                            <span className="font-bold italic">Attachment</span>{" "}
                            file role are supporting document files .
                        </p>
                    </InputHelper>
                </div>
                {withNameInput && (
                    <div className="grid gap-1.5">
                        <Label>File Name</Label>
                        <Input
                            onChange={(e) =>
                                setFileName(hyphen_uc_words(e.target.value))
                            }
                            value={fileName}
                        />
                        <InputError
                            message={errors.fileName}
                            className="mt-2"
                        />
                        <InputHelper>
                            - Please provide a descriptive file name that
                            clearly reflects the content of the document or
                            file.
                        </InputHelper>
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
                                disabled={processing}
                                variant="secondary"
                                size="sm"
                                onClick={() => handleSubmit("file")}
                            >
                                Upload
                            </Button>
                        </div>
                        <InputError message={errors.file} className="mt-2" />
                        <InputHelper className="mt-2">
                            <p>- Allowed formats: PDF, JPG, PNG, DOCX, DOC</p>
                            <p>- Max 10 MB file size.</p>
                        </InputHelper>
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
                        <InputHelper className="mt-2">
                            <p>
                                - You can upload larger files via{" "}
                                <a
                                    className="underline"
                                    href="https://www.google.com/drive/"
                                    target="_blank"
                                >
                                    Google Drive
                                </a>{" "}
                                or any other cloud storage provider and then add
                                the url in the URL tab.
                            </p>
                            <p>
                                - Include https://www. or http://www. in the
                                URL.
                            </p>
                        </InputHelper>
                    </TabsContent>
                </Tabs>
                {processing && (
                    <div>
                        <Progress value={progress} />
                    </div>
                )}

                {documentFiles.length > 0 ? (
                    <Collapsible defaultOpen>
                        <div className="flex items-center space-x-4">
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    View Included Files
                                    <Icons.chevronsUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </CollapsibleTrigger>
                        </div>

                        <CollapsibleContent className="mt-2 space-y-8 px-2">
                            {}
                            <div className="space-y-2">
                                <h1>Backup:</h1>
                                <div className="mt-4 max-w-xl space-y-2">
                                    {documentFiles
                                        .filter(
                                            (file) => file.role === "backup",
                                        )
                                        .map((file, index) => (
                                            <DocumentFileCard
                                                key={index}
                                                file={file}
                                                handleFileDelete={
                                                    handleFileDelete
                                                }
                                                withDeleteButton={
                                                    user.id === file.uploader_id
                                                }
                                            />
                                        ))}
                                </div>
                            </div>

                            <div>
                                <h1>Attachment:</h1>

                                <div className="mt-4 max-w-xl space-y-2">
                                    {documentFiles
                                        .filter(
                                            (file) =>
                                                file.role === "attachment",
                                        )
                                        .map((file, index) => (
                                            <DocumentFileCard
                                                key={index}
                                                file={file}
                                                handleFileDelete={
                                                    handleFileDelete
                                                }
                                                withDeleteButton={
                                                    user.id === file.uploader_id
                                                }
                                            />
                                        ))}
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                ) : (
                    <div className="font-bold">No Files Uploaded.</div>
                )}
            </div>
        </div>
    );
}

export default memo(DocumentFilesForm);
