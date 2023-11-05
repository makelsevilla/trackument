import { Input } from "@/Components/ui/input.jsx";
import { Button } from "@/Components/ui/button.jsx";
import { useState } from "react";
import { router } from "@inertiajs/react";

export default function NavTrackingForm({ className }) {
    const [trackingCode, setTrackingCode] = useState("");
    function handleSubmit(e) {
        e.preventDefault();
        router.get(route("history", { tracking_code: trackingCode }));
    }

    return (
        <form onSubmit={handleSubmit} className={className}>
            <Input
                className="max-w-xs"
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="Tracking Code"
            />
            <Button type="submit" variant="secondary">
                Track
            </Button>
        </form>
    );
}
