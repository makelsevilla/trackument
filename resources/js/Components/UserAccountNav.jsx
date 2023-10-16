import { Link, router } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu.jsx";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/Components/ui/avatar.jsx";
import Icons from "@/Components/Icons.jsx";

export default function UserAccountNav({ user }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                {/*User Avatar*/}
                <Avatar className="h-8 w-8">
                    {user.image ? (
                        <AvatarImage alt="Picture" src={user.image} />
                    ) : (
                        <AvatarFallback>
                            <span className="sr-only">{user.name}</span>
                            <Icons.user className="h-5 w-5" />
                        </AvatarFallback>
                    )}
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        {user.name && (
                            <p className="font-medium">{user.name}</p>
                        )}
                        {user.email && (
                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                                {user.email}
                            </p>
                        )}
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={route("profile.edit")}>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(event) => {
                        event.preventDefault();
                        router.post(route("logout"));
                    }}
                >
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
