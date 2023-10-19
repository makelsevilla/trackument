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

export default function EditDraft({ auth, draftDocument, documentTypes }) {
    const { data, setData, errors } = useForm({
        document_type_id: draftDocument["document_type_id"]?.toString(),
        title: draftDocument.title,
        description: draftDocument.description,
        purpose: draftDocument.purpose || [],
    });

    console.log(documentTypes);

    return (
        <div className="container mx-auto grid items-start gap-10 py-8">
            <form>
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
                        <Button type="">Save</Button>
                    </div>
                    <div>
                        <div className="mx-auto max-w-xl">
                            <div className="mt-4 grid w-full items-center gap-1.5">
                                <Label htmlFor="document_type">
                                    Document Type
                                </Label>
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
                            <div className="mt-4 grid w-full items-center gap-1.5">
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
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
