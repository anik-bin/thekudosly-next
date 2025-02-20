"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Dashboard() {
    const {data: session, status} = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated" && session?.user && !session?.user.username) {
            router.replace("/login"); // Redirect if the user doesn't have a username
        }
    }, [session]); // Ensure correct dependencies

    if (status === "loading") return <p>Loading...</p>;

    return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen dark:bg-gray-800">
            <h1>Dashboard</h1>
            <p>Welcome, {session?.user.username}</p>
            <Image src={session?.user.image || "/vercel.svg"} alt="Profile" width={100} height={100} />
            <p>{session?.user.kudos}</p>
            <button onClick={()=> signOut()}>Logout</button>
        </div>
    )

}