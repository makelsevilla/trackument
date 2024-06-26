import { Button } from "@/Components/ui/button.jsx";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
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
import { Checkbox } from "@/Components/ui/checkbox.jsx";
import DocumentFilesForm from "@/Pages/Document/DocumentFilesForm.jsx";
import { Separator } from "@/Components/ui/separator.jsx";
import { ucwords } from "@/lib/utils.js";
import { Toaster } from "@/Components/ui/toaster.jsx";
import { useToast } from "@/Components/ui/use-toast.js";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog.jsx";

export default function EditDraft({
    auth,
    document,
    documentTypes,
    documentPurposes,
}) {
    const [typeIdDescription, setTypeIdDescription] = useState({});
    const [relatedDocumentInput, setRelatedDocumentInput] = useState("");
    const { data, setData, errors, put, processing } = useForm({
        document_type_id: document["document_type_id"]?.toString(),
        title: document.title || "",
        description: document.description || "",
        purpose: document.purpose || [],
        related_documents: document?.related_documents || [],
        notify_owner: document.notify_owner,
    });
    const { toast } = useToast();
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.message) {
            toast({
                description: flash.message,
                variant: flash?.type === "error" ? "destructive" : "",
                duration: 3000,
            });
        }
    }, [flash]);
    const handleSubmit = (type = "update") => {
        let routeName = "";
        if (type === "update") {
            routeName = "documents.update";
        } else if (type === "finalize") {
            routeName = "documents.finalize";
        }
        put(route(routeName, { document: document.id }));
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
        documentTypes?.forEach((type) => {
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
                                <Link href={route("documents.lists.drafts")}>
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
                                onClick={(e) => handleSubmit("update")}
                                disabled={processing}
                                variant="secondary"
                            >
                                <span>Save</span>
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="sm">
                                        <span>Finalize</span>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Finalize Document
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            You CANNOT make any changes to this
                                            document once it has been finalized.
                                            Are you sure you want to proceed?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={(e) =>
                                                handleSubmit("finalize")
                                            }
                                            disabled={processing}
                                        >
                                            Proceed
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                    <div>
                        <div className="mx-auto max-w-xl">
                            {/* Document Type */}
                            <div className="grid w-full gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="document_type">
                                        Document Type{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
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
                                            {documentTypes?.map(
                                                (type, index) => {
                                                    return (
                                                        <SelectItem
                                                            key={index}
                                                            value={type.id.toString()}
                                                        >
                                                            <span className="capitalize">
                                                                {type.name}
                                                            </span>
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
                                <Label htmlFor="title">
                                    Title{" "}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    onChange={(e) =>
                                        setData(
                                            "title",
                                            ucwords(e.target.value),
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
                                        - You may omit sensitive informations
                                        (monitory amounts, names, etc.) from the
                                        title if they are not necessary in
                                        tracking the document.
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
                                    <Label htmlFor="purpose">
                                        Purpose{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Check all that apply.
                                    </p>
                                </div>
                                <div className=" space-y-4 rounded-md border p-4">
                                    {documentPurposes?.map((purpose, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2"
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
                                </div>
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

                            {/*Receive Notifications*/}
                            <div className="mt-4">
                                <Label>Notifications</Label>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={data.notify_owner}
                                        onCheckedChange={(checked) =>
                                            setData("notify_owner", checked)
                                        }
                                        id="notify_owner"
                                    />
                                    <label htmlFor="notify_owner">
                                        Receive notifications whenever someone
                                        processes this document.
                                    </label>
                                </div>
                            </div>

                            <Separator className="my-6" />
                            <h2 className="text-xl font-semibold">
                                Document Files{" "}
                                <span className="text-sm italic">
                                    (Optional)
                                </span>
                            </h2>
                            {/* File Backup */}
                            <DocumentFilesForm
                                documentId={document.id}
                                role="backup"
                                withNameInput
                                className="mt-4"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    );
}
