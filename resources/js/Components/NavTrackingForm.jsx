import { Input } from "@/Components/ui/input.jsx";
import { Button } from "@/Components/ui/button.jsx";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { cn } from "@/lib/utils.js";

export default function NavTrackingForm({ className }) {
    const [trackingCode, setTrackingCode] = useState("");
    function handleSubmit(e) {
        e.preventDefault();

        if (trackingCode === "") return;

        router.get(route("track", { tracking_code: trackingCode }));
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={cn("flex items-center gap-2", className)}
        >
            <Input
                required
                className=" rounded-full border-2"
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="Tracking Code"
            />
            <Button size="sm" type="submit" className="rounded-2xl">
                Track
            </Button>
        </form>
    );
}
