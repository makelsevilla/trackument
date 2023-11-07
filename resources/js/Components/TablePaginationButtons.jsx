import { Button } from "@/Components/ui/button.jsx";
import { Link } from "@inertiajs/react";
import Icons from "@/Components/Icons.jsx";

export default function TablePaginationButtons({ paginate }) {
    return (
        <div className="flex items-center gap-2">
            <Button
                variant="secondary"
                size="icon"
                disabled={paginate.current_page === 1}
                asChild={paginate.current_page !== 1}
            >
                <Link href={paginate.first_page_url}>
                    <Icons.chevronFirst className="h-4 w-4" />
                </Link>
            </Button>
            <Button
                variant="secondary"
                size="icon"
                disabled={paginate.current_page === 1}
                asChild={paginate.current_page !== 1}
            >
                <Link href={paginate.prev_page_url}>
                    <Icons.chevronLeft className="h-4 w-4" />
                </Link>
            </Button>
            <div className="text-sm">
                <span>
                    {paginate.current_page} of {paginate.last_page}
                </span>
            </div>
            <Button
                variant="secondary"
                size="icon"
                disabled={paginate.current_page === paginate.last_page}
                asChild={paginate.current_page !== paginate.last_page}
            >
                <Link href={paginate.next_page_url}>
                    <Icons.chevronRight className="h-4 w-4" />
                </Link>
            </Button>
            <Button
                variant="secondary"
                size="icon"
                disabled={paginate.current_page === paginate.last_page}
                asChild={paginate.current_page !== paginate.last_page}
            >
                <Link href={paginate.last_page_url}>
                    <Icons.chevronLast className="h-4 w-4" />
                </Link>
            </Button>
        </div>
    );
}
