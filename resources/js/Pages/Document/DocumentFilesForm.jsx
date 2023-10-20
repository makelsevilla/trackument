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

function DocumentFilesForm({ ...props }) {
    const [draftDocumentFiles, setDraftDocumentFiles] = useState(null);
    const { data, setData, errors, post } = useForm({
        data: "",
        type: "url",
    });

    const getDraftDocumentFiles = () => {
        axios
            .get(route("draft.files.index"))
            .then((response) => setDraftDocumentFiles(response.data))
            .catch((error) => console.log(error));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("draft.files.store"), {
            onSuccess: () => getDraftDocumentFiles(),
        });
    };

    useEffect(() => {
        getDraftDocumentFiles();
    }, []);

    return (
        <div {...props}>
            <div className="grid w-full gap-1.5">
                <Label>File Backup</Label>
                <Tabs defaultValue="upload">
                    <TabsList>
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                        <TabsTrigger value="url">URL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload">
                        <div className="flex items-center gap-2">
                            <Input
                                onChange={(e) =>
                                    setData({
                                        data: e.target.files[0],
                                        type: "file",
                                    })
                                }
                                id="backup_file"
                                type="file"
                            />
                            <Button onClick={handleSubmit}>Upload</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="url">
                        <div className="flex items-center gap-2">
                            <Input
                                onChange={(e) =>
                                    setData({
                                        data: e.target.value,
                                        type: "url",
                                    })
                                }
                                placeholder="e.g https://www.example-site.com/"
                                type="text"
                            />
                            <Button onClick={handleSubmit}>Add</Button>
                        </div>
                    </TabsContent>
                </Tabs>

                <InputError message={errors.data} className="mt-2" />
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
