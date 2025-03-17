"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated" && session?.user && !session?.user.username) {
            router.replace("/login"); // Redirect if the user doesn't have a username
        }
    }, [session]); // Ensure correct dependencies

    if (status === "loading") return <p>Loading...</p>;

    return (
        // <>
        // <Navbar />
        // <div className="flex flex-col gap-4 items-center justify-center h-screen dark:bg-gray-800">
        //     <h1>Dashboard</h1>
        //     <p>Welcome, {session?.user.username}</p>
        //     <p>Kudos: {session?.user.kudos}</p>
        //     <Button onClick={()=> signOut()} variant="default">Logout</Button>
        // </div>
        // </>

        <div className="h-screen grid grid-rows-[auto,1fr] grid-cols-1">
            {/* Navbar */}
            <Navbar />

            {/* Sidebar + Main Content */}
            <div className="grid grid-cols-[250px,1fr] h-full">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="p-6">
                    <h1>Hello</h1>
                </main>
            </div>
        </div>
    )

}