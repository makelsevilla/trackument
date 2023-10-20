import { Button } from "@/Components/ui/button.jsx";
import { Link, useForm } from "@inertiajs/react";
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

export default function EditDraft({
    auth,
    draftDocument,
    documentTypes,
    documentPurposes,
}) {
    const [typeIdDescription, setTypeIdDescription] = useState({});
    const { data, setData, errors, patch } = useForm({
        document_type_id: draftDocument["document_type_id"]?.toString(),
        title: draftDocument.title,
        description: draftDocument.description || "",
        purpose: draftDocument.purpose || [],
    });

    useEffect(() => {
        const typeIdDescription = {};
        documentTypes.forEach((type) => {
            typeIdDescription[type.id.toString()] = type.description;
        });
        setTypeIdDescription(typeIdDescription);
    }, [documentTypes]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);

        patch(route("draft.documents.update"));
    };

    // console.log(data.purpose);
    return (
        <div className="container mx-auto grid items-start gap-10 py-8">
            <form onSubmit={handleSubmit}>
                <div className="grid w-full gap-10">
                    <div className="flex w-full items-center justify-between">
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
                        <Button type="submit">Save</Button>
                    </div>
                    <div>
                        <div className="mx-auto max-w-xl">
                            <div className="mt-4 grid w-full gap-1.5">
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

                            <div className="mt-4 grid w-full gap-1.5">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    onChange={(e) =>
                                        setData("title", e.target.value)
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
                                                        if (checked) {
                                                            setData("purpose", [
                                                                ...data.purpose,
                                                                purpose.purpose,
                                                            ]);
                                                        } else {
                                                            setData(
                                                                "purpose",
                                                                data.purpose.filter(
                                                                    (item) =>
                                                                        item !==
                                                                        purpose.purpose,
                                                                ),
                                                            );
                                                        }
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
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
