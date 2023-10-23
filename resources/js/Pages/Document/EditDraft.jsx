import { Button } from "@/Components/ui/button.jsx";
import { Head, Link, useForm } from "@inertiajs/react";
import Icons from "@/Components/Icons.jsx";
import { Label } from "@/Components/ui/label.jsx";
import { Input } from "@/Components/ui/input.jsx";
import InputError from "@/Components/InputError.jsx";
import InputHelper from "@/Components/InputHelper.jsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select.jsx";
import { useEffect, useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover.jsx";
import { Textarea } from "@/Components/ui/textarea.jsx";
import { ScrollArea } from "@/Components/ui/scroll-area.jsx";
import { Checkbox } from "@/Components/ui/checkbox.jsx";
import DocumentFilesForm from "@/Pages/Document/DocumentFilesForm.jsx";

export default function EditDraft({
    auth,
    draftDocument,
    documentTypes,
    documentPurposes,
}) {
    const [typeIdDescription, setTypeIdDescription] = useState({});
    const [relatedDocumentInput, setRelatedDocumentInput] = useState("");
    const { data, setData, errors, put, processing } = useForm({
        document_type_id: draftDocument["document_type_id"]?.toString(),
        title: draftDocument.title,
        description: draftDocument.description || "",
        purpose: draftDocument.purpose || [],
        related_documents: draftDocument?.related_documents || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route("draft.documents.update", { document: draftDocument.id }));
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

    useEffect(() => {
        const typeIdDescription = {};
        documentTypes.forEach((type) => {
            typeIdDescription[type.id.toString()] = type.description;
        });
        setTypeIdDescription(typeIdDescription);
    }, [documentTypes]);

    return (
        <div className="container mx-auto grid items-start gap-10 py-8">
            <Head title="Edit Draft" />
            <div>
                <div className="grid w-full gap-10">
                    <div className="flex w-full flex-wrap items-center justify-between">
                        <div className="flex items-center space-x-10">
                            <Button variant="ghost" asChild>
                                <Link href={route("dashboard")}>
                                    <Icons.chevronLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Link>
                            </Button>
                            <p className="text-sm text-muted-foreground">
                                Draft
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <Button
                                size="sm"
                                onClick={handleSubmit}
                                disabled={processing}
                                variant="secondary"
                            >
                                {processing ? (
                                    <>
                                        <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <span>Save</span>
                                )}
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSubmit}
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
                                        Finalizing...
                                    </>
                                ) : (
                                    <span>Finalize</span>
                                )}
                            </Button>
                        </div>
                    </div>
                    <div>
                        <div className="mx-auto max-w-xl">
                            {/* Document Type */}
                            <div className="grid w-full gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="document_type">
                                        Document Type
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger>
                                            <Icons.helpCircle className="h-4 w-4" />
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <p className="text-sm text-muted-foreground">
                                                {typeIdDescription[
                                                    data.document_type_id
                                                ] || "No description"}
                                            </p>
                                        </PopoverContent>
                                    </Popover>
                                </div>
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
                                            {documentTypes.map(
                                                (type, index) => {
                                                    return (
                                                        <SelectItem
                                                            key={index}
                                                            value={type.id.toString()}
                                                        >
                                                            {type.name}
                                                        </SelectItem>
                                                    );
                                                },
                                            )}
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
                                        setData(
                                            "title",
                                            e.target.value.toUpperCase(),
                                        )
                                    }
                                    value={data.title}
                                    type="text"
                                    id="title"
                                />
                                <InputError
                                    message={errors.title}
                                    className="mt-2"
                                />
                                <InputHelper>
                                    <p>
                                        - You may omit sensitive informations.
                                    </p>
                                    <p>- Max Length: 250 characters</p>
                                </InputHelper>
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
                                    <p className="text-xs text-muted-foreground">
                                        Check all that apply.
                                    </p>
                                </div>
                                <ScrollArea className="max-h-[200px] rounded-md border p-4">
                                    {documentPurposes.map((purpose, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="mb-4 flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    onCheckedChange={(
                                                        checked,
                                                    ) => {
                                                        checked
                                                            ? setData(
                                                                  "purpose",
                                                                  [
                                                                      ...data.purpose,
                                                                      purpose.purpose,
                                                                  ],
                                                              )
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
                                                    htmlFor={
                                                        "purpose" + purpose.id
                                                    }
                                                    className="text-sm capitalize"
                                                >
                                                    {purpose.purpose}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </ScrollArea>
                                <InputError
                                    message={errors.purpose}
                                    className="mt-2"
                                />
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
                                        if (
                                            key.startsWith("related_documents")
                                        ) {
                                            return (
                                                <InputError
                                                    key={index}
                                                    message={errors[key]}
                                                />
                                            );
                                        }
                                    })}
                                </div>

                                <InputHelper>
                                    - You may add the tracking code of the
                                    documents related to this document.
                                </InputHelper>
                            </div>

                            {/* File Backup */}
                            <DocumentFilesForm className="mt-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
