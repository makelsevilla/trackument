import { Label } from "@/Components/ui/label.jsx";
import { Input } from "@/Components/ui/input.jsx";
import InputError from "@/Components/InputError.jsx";
import InputHelper from "@/Components/InputHelper.jsx";
import { memo, useEffect, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs.jsx";
import { Button } from "@/Components/ui/button.jsx";

function DocumentFilesForm({ role = "backup", documentId = null, ...props }) {
    const [draftDocumentFiles, setDraftDocumentFiles] = useState(null);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [fileLink, setFileLink] = useState("");
    const [errors, setErrors] = useState({});

    const getDraftDocumentFiles = () => {
        axios
            .get(route("draft.document_files.index"))
            .then((response) => setDraftDocumentFiles(response.data))
            .catch((error) => console.log(error));
    };

    const handleSubmit = (type = "file") => {
        e.preventDefault();

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
            .post(route("draft.document_files.store"), { ...data })
            .then((response) => {
                console.log(response.data);
                getDraftDocumentFiles();
            })
            .catch((error) => {
                if (error.response.status === 422) {
                    setErrors(error.response.data.errors);
                }
            });
    };

    useEffect(() => {
        getDraftDocumentFiles();
    }, []);

    return (
        <div {...props}>
            <div className="grid w-full gap-1.5">
                <Label>File Backup</Label>
                <div>
                    <Input
                        onChange={(e) => setFileName(e.target.value)}
                        value={fileName}
                        placeholder="File Name"
                    />
                    <InputError
                        message="File name is required."
                        className="mt-2"
                    />
                </div>
                <Tabs defaultValue="upload">
                    <TabsList>
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                        <TabsTrigger value="url">URL</TabsTrigger>
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
                                onClick={handleSubmit}
                            >
                                Upload
                            </Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="url">
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
                                onClick={handleSubmit}
                            >
                                Add
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>

                <InputError message="error message" className="mt-2" />
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
