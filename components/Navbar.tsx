"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useEffect, useState } from "react";


export default function Navbar() {
    const { data: session } = useSession();
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAboutOpen(true);
        }, 500);

        return () => clearTimeout(timer);
    }, [])


    return (
        <nav className="w-full flex flex-wrap items-center justify-between px-4 sm:px-6 py-4 bg-black shadow-md text-white">
            {/* Left Section: Logo */}
            <Link href="/" className="text-xl font-bold">
                <Image src="/logo.png" alt="logo" width={200} height={10} className="sm:w-[250px]" />
            </Link>

            {/* Center Section: About Button - Order changes on mobile */}
            <div className="order-3 w-full md:w-auto md:order-2 mt-2 md:mt-0 md:mx-4">
                <AlertDialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
                    <AlertDialogTrigger className="w-full md:w-auto bg-[#1B1B1A] p-3 hover:bg-[#41413e] rounded-sm">
                        About
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>What is thekudosly?</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                                thekudosly is a platform to discover and share the internet&apos;s interesting and valuable videos
                            </AlertDialogDescription>
                            <AlertDialogTitle>What is kudos?</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">Imagine having a way to genuinely appreciate great videos? That&apos;s where our Kudos system comes in.
                                <br />
                                <br />
                                Every day, you receive 3 Kudos. Think of them as special tokens of appreciation. When you find a video that truly impresses you, you can give it a Kudos, helping great content rise to the top.</AlertDialogDescription>
                            <AlertDialogTitle>What is recommend?</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">Got a video that blew your mind? Share it with the community!
                                <br />
                                <br />
                                One kudos at a time
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Let&apos;s go back to website</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            {/* Right Section: Auth Buttons or Profile */}
            <div className="order-2 md:order-3">
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