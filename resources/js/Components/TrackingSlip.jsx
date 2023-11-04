import { cn } from "@/lib/utils.js";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/Components/ui/button.jsx";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function TrackingSlip({ trackingCode, className }) {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        bodyClass: "flex justify-center mt-[20%] items-center",
        documentTitle: `Tracking Slip ${trackingCode}`,
    });

    return (
        <div className={cn("flex flex-col items-center gap-4 p-8", className)}>
            <div ref={componentRef} className="max-w-fit text-center">
                <QRCodeSVG value={trackingCode} className="h-48 w-48" />
                <p className="text-2xl font-bold">{trackingCode}</p>
            </div>
            <Button onClick={handlePrint} size="lg">
                Print
            </Button>
        </div>
    );
}
