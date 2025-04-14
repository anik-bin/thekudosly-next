import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

const Sidebar = () => {

    const { data: session } = useSession();
    const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });

    const KUDOS_REFRESH_INTERVAL = 24 * 60 * 60 * 1000;

    const calculateTimeUntilNextRefresh = (lastKudosRefresh: number | null): number => {
        if (!lastKudosRefresh) {
            return 0;
        }
        const nextRefreshTime = lastKudosRefresh + KUDOS_REFRESH_INTERVAL;
        const timeUntilNextRefresh = nextRefreshTime - Date.now();

        return Math.max(0, timeUntilNextRefresh);
    }

    const formatTime = (milliseconds: number): { hours: number; minutes: number; seconds: number } => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);


        return { hours, minutes, seconds };
    };

    useEffect(() => {
        if (session?.user?.lastKudosRefresh) {
            const intervalId = setInterval(() => {
                const remainingTime = calculateTimeUntilNextRefresh(session.user.lastKudosRefresh as number);
                setTimeRemaining(formatTime(remainingTime));
            }, 1000);


            return () => clearInterval(intervalId);
        }
    }, [session?.user?.lastKudosRefresh]);
    

    


    return (
        <aside className="p-4 space-y-6">
            {/* Kudos Counter */}
            <div className="p-4 rounded-lg shadow-md text-center bg-gray-800">
                <h2 className="text-lg font-semibold">Kudos: {session?.user.kudos}</h2>
                
                {session?.user.lastKudosRefresh ? (
                    <div>
                        <p className="text-sm text-gray-400">Time until refresh:</p>
                        <p className="text-lg font-semibold">
                            {timeRemaining.hours}h : {timeRemaining.minutes}m : {timeRemaining.seconds}s
                        </p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">Kudos will refresh every 24 hours.</p>
                )}
            </div>

            

            {/* Navigation Links */}
            <nav className="space-y-3">
                <Link href="/recommend" className="block p-2 rounded-lg shadow bg-[#1B1B1A] hover:bg-[#41413e]">
                    Recommend
                </Link>
                <Link href="/dashboard" className="block p-2 rounded-lg shadow bg-[#1B1B1A] hover:bg-[#41413e]">
                    Trending
                </Link>
                <Link href="/contact" className="block p-2 rounded-lg shadow bg-[#1B1B1A] hover:bg-[#41413e]">
                    Contact Us
                </Link>
                <Button variant="destructive" className="w-full" onClick={() => signOut()}>
                    Logout
                </Button>
            </nav>
        </aside>
    )
}

export default Sidebar