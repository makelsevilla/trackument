import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function ucwords(str) {
    return (str + "").replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
    });
}

export function hyphen_uc_words(str) {
    return str.toUpperCase().replace(/\s+/g, "-");
}
