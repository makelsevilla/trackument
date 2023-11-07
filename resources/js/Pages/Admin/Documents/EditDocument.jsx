import Breadcrumb from "@/Components/Breadcrumb.jsx";
import DashboardHeader from "@/Components/DashboardHeader.jsx";
import { Button } from "@/Components/ui/button.jsx";
import { Link, useForm } from "@inertiajs/react";
import { Label } from "@/Components/ui/label.jsx";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select.jsx";
import InputError from "@/Components/InputError.jsx";
import { Input } from "@/Components/ui/input.jsx";
import { ucwords } from "@/lib/utils.js";
import InputHelper from "@/Components/InputHelper.jsx";
import { Textarea } from "@/Components/ui/textarea.jsx";
import { ScrollArea } from "@/Components/ui/scroll-area.jsx";
import { Checkbox } from "@/Components/ui/checkbox.jsx";
import { Separator } from "@/Components/ui/separator.jsx";
import DocumentFilesForm from "@/Pages/Document/DocumentFilesForm.jsx";
import AdminLayout from "@/Layouts/AdminLayout.jsx";
import { useEffect, useState } from "react";

export default function EditDocument({
    auth,
    document,
    documentTypes,
    documentPurposes,
}) {
    const [relatedDocumentInput, setRelatedDocumentInput] = useState("");
    const { data, setData, errors, put, processing } = useForm({
        document_type_id: document["document_type_id"]?.toString(),
        title: document.title || "",
        description: document.description || "",
        purpose: document.purpose || [],
        related_documents: document?.related_documents || [],
    });
    const handleSubmit = () => {
        put(route("admin.documents.update", { document: document.id }));
    };

    const addRelatedDocumentToData = (e) => {
        e.preventDefault();
        if (relatedDocumentInput) {
            if (!data.related_documents.includes(relatedDocumentInput)) {
                setData("related_documents", [
                    ...data.related_documents,
                    relatedDocumentInput,
                ]);
            }
            setRelatedDocumentInput("");
        }
    };

    const removeRelatedDocumentFromData = (trackCode) => {
        setData(
            "related_documents",
            data.related_documents.filter((item) => item !== trackCode),
        );
    };
    return (
        <AdminLayout user={auth.user}>
            <div className="flex flex-col justify-start gap-8">
                <Breadcrumb
                    items={[
                        {
                            label: "Home",
                            href: route("admin.dashboard"),
                        },
                        {
                            label: "Documents",
                            href: route("admin.documents.index"),
                        },
                        {
                            label: document.tracking_code,
                        },
                        {
                            label: "Edit",
                        },
                    ]}
                />
                <DashboardHeader heading="Edit Document">
                    <Button onClick={handleSubmit} disabled={processing}>
                        Save
                    </Button>
                </DashboardHeader>

                {/*Content*/}
                <div className="flex flex-col gap-4 p-2">
                    {/* Document Type */}
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="document_type">Document Type</Label>
                        <Select
                            value={data.document_type_id}
                            onValueChange={(value) =>
                                setData("document_type_id", value)
                            }
                            id="document_type"
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a document type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {documentTypes?.map((type, index) => {
                                        return (
                                            <SelectItem
                                                key={index}
                                                value={type.id.toString()}
                                            >
                                                {type.name}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <InputError
                            message={errors.document_type_id}
                            className="mt-2"
                        />
                    </div>

                    {/* Title */}
                    <div className="mt-4 grid w-full gap-1.5">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            onChange={(e) =>
                                setData("title", ucwords(e.target.value))
                            }
                            value={data.title}
                            type="text"
                            id="title"
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    {/* Description */}
                    <div className="mt-4 grid w-full gap-1.5">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            value={data.description}
                            id="description"
                        />
                        <InputError
                            message={errors.description}
                            className="mt-2"
                        />
                    </div>

                    {/* Purposes */}
                    <div className="mt-4 grid w-full gap-1.5">
                        <div>
                            <Label htmlFor="purpose">Purpose</Label>
                        </div>
                        <div className="rounded-md border p-4">
                            {documentPurposes?.map((purpose, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="mb-4 flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            onCheckedChange={(checked) => {
                                                checked
                                                    ? setData("purpose", [
                                                          ...data.purpose,
                                                          purpose.purpose,
                                                      ])
                                                    : setData(
                                                          "purpose",
                                                          data.purpose.filter(
                                                              (item) =>
                                                                  item !==
                                                                  purpose.purpose,
                                                          ),
                                                      );
                                            }}
                                            checked={data.purpose.includes(
                                                purpose.purpose,
                                            )}
                                            id={"purpose" + purpose.id}
                                        />
                                        <label
                                            htmlFor={"purpose" + purpose.id}
                                            className="text-sm capitalize"
                                        >
                                            {purpose.purpose}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                        <InputError message={errors.purpose} className="mt-2" />
                    </div>

                    {/* Related Documents */}
                    <div className="mt-4 grid w-full gap-1.5">
                        <Label htmlFor="related_documents">
                            Related Documents
                        </Label>
                        <div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    placeholder="UNC-0000-0"
                                    onChange={(e) =>
                                        setRelatedDocumentInput(
                                            e.target.value.toUpperCase(),
                                        )
                                    }
                                    value={relatedDocumentInput}
                                    id="related_documents"
                                />
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={addRelatedDocumentToData}
                                >
                                    Add
                                </Button>
                            </div>
                            <div className="mt-2 space-y-2">
                                {data.related_documents.length ? (
                                    data.related_documents.map(
                                        (trackCode, index) => {
                                            return (
                                                <div
                                                    className="flex items-center space-x-2"
                                                    key={index}
                                                >
                                                    <Button
                                                        className="h-5 w-5 rounded-full p-2 hover:bg-destructive hover:text-destructive-foreground"
                                                        variant="secondary"
                                                        onClick={() =>
                                                            removeRelatedDocumentFromData(
                                                                trackCode,
                                                            )
                                                        }
                                                    >
                                                        X
                                                    </Button>
                                                    <p className="text-sm">
                                                        {trackCode}
                                                    </p>
                                                </div>
                                            );
                                        },
                                    )
                                ) : (
                                    <div className="text-sm text-muted-foreground">
                                        No related documents included.
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            {Object.keys(errors).map((key, index) => {
                                if (key.startsWith("related_documents")) {
                                    return (
                                        <InputError
                                            key={index}
                                            message={errors[key]}
                                        />
                                    );
                                }
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
