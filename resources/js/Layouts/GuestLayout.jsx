import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import Icons from "@/Components/Icons.jsx";
import BaniLogo from "@/Components/BaniLogo.jsx";

export default function Guest({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div className="flex flex-col items-center">
                <Link href="/" className="flex gap-3">
                    <Icons.logo className="h-20 w-20" />
                    <BaniLogo className="h-20 w-20 rounded-full" />
                </Link>
                <p className="mt-4 text-5xl font-bold">Trackument</p>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
