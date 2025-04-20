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


export default function Navbar() {
    const { data: session, status } = useSession();

    return (
        <nav className="w-full flex items-center justify-between px-6 py-4 bg-black shadow-md text-white">
            {/* Left Section: Logo */}
            <Link href="/" className="text-xl font-bold">
                <Image src="/logo.png" alt="logo" width={250} height={10} />
            </Link>

            <AlertDialog>
                <AlertDialogTrigger className="bg-[#1B1B1A] p-3 hover:bg-[#41413e] rounded-sm">About</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>What is thekudosly?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            thekudosly is a platform to discover and share the internet's interesting and valuable videos
                        </AlertDialogDescription>
                        <AlertDialogTitle>What is kudos?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">Imagine having a way to genuinely appreciate great videos? That's where our Kudos system comes in.
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
                        <AlertDialogCancel>Let's go back to website</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Right Section: Auth Buttons or Profile */}
            <div>
                {session ? (
                    <Link href={`/profile/${session.user.username}`}>
                        <div className="flex gap-2 items-center bg-[#1B1B1A] p-2 hover:bg-[#41413e] rounded-sm">
                            <Avatar className="w-9 h-9 cursor-pointer">
                                <AvatarImage src={session.user.image || "/default-avatar.png"} />
                                <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>

                            <div className="flex flex-row gap-2">
                                <Image src="/icon.png" alt="icon" width={32} height={32} />
                                <h1 className="text-2xl">{session.user.kudos}</h1>
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