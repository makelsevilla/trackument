import { Button } from "@/Components/ui/button.jsx";
import { Link } from "@inertiajs/react";

export default function PaginationButtons({ prev_page_url, next_page_url }) {
    return (
        <div className="flex items-center gap-2">
            {prev_page_url ? (
                <Button variant="outline" asChild>
                    <Link href={prev_page_url}>Previous</Link>
                </Button>
            ) : (
                <Button asChild variant="outline" disabled>
                    Previous
                </Button>
            )}

            {next_page_url ? (
                <Button variant="outline" asChild>
                    <Link href={next_page_url}>Next</Link>
                </Button>
            ) : (
                <Button asChild variant="outline" disabled>
                    Next
                </Button>
            )}
        </div>
    );
}
