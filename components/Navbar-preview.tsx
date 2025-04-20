"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function NavbarPreview() {
    const { data: session, status } = useSession();

    return (
        <nav className="w-full flex items-center justify-between px-4 sm:px-6 py-4 bg-black shadow-md text-white">
            {/* Left Section: Logo */}
            <Link href="/" className="text-xl font-bold">
                <Image src="/logo.png" alt="logo" width={200} height={10} className="sm:w-[250px]" />
            </Link>

            {/* Right Section: Auth Buttons or Profile */}
            <div>
                {session ? (
                    <Link href={`/profile/${session.user.username}`}>
                        <div className="flex items-center bg-[#1B1B1A] p-2 hover:bg-[#41413e] rounded-sm">
                            <Avatar className="w-9 h-9 cursor-pointer">
                                <AvatarImage src={session.user.image || "/default-avatar.png"} />
                                <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>

                            <div className="flex items-center ml-2">
                                <Image src="/icon.png" alt="icon" width={24} height={24} className="mr-1" />
                                <span className="text-lg sm:text-2xl whitespace-nowrap">{session.user.kudos}</span>
                            </div>
                        </div>
                    </Link>
                ) : (
                    <div className="flex gap-2">
                        <Link href="/login">
                            <Button variant="secondary">Login/Signup</Button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}