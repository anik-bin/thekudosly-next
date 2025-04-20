import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

interface SidebarProps {
    activePage?: string;
}

const Sidebar = ({ activePage = "" }: SidebarProps) => {
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

    const getLinkClassName = (page: string) => {
        return `flex gap-2 p-2 rounded-lg shadow ${activePage === page
                ? "bg-[#363634] text-white"
                : "bg-[#1B1B1A] hover:bg-[#41413e]"
            }`;
    };

    return (
        <aside className="p-4 space-y-6">
            {/* Kudos Counter */}
            <div className="p-4 rounded-lg shadow-md text-center bg-[#1B1B1A]">
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
                <Link href="/recommend" className={getLinkClassName("recommend")}>
                    🎬 Recommend
                </Link>
                <Link href="/" className={getLinkClassName("trending")}>
                    ⚡️ Trending
                </Link>
                <Link href="/contact" className={getLinkClassName("contact")}>
                    📬 Contact Us
                </Link>
                {session && (
                    <Button variant="destructive" className="w-full" onClick={() => signOut()}>
                        Logout
                    </Button>
                )}
                
            </nav>
        </aside>
    );
};

export default Sidebar;