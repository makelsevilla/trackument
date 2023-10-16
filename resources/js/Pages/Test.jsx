import { Button } from "@/Components/ui/button";
import { usePage } from "@inertiajs/react";

export default function Test() {
    const { ziggy } = usePage().props;
    console.log(ziggy);
    console.log(route("dashboard"));
    console.log(ziggy.location);

    const url = new URL(ziggy.location);
    console.log(url.pathname == "/test");
    return <Button>shadcn</Button>;
}
