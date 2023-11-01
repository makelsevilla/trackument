import { Input } from "@/Components/ui/input.jsx";

/**
 * Filter component props
 * @typedef {Object} FilterProps
 * @property {function(string): void} onFilterChange - A callback function that is called when the filter changes.
 */

/**
 * A filter component.
 * @param {FilterProps} props - The props for the filter component.
 * @returns {JSX.Element} The filter component.
 */
export default function TableFilter({}) {
    return (
        <div>
            <Input type="text" placeholder="Search..." />
        </div>
    );
}
