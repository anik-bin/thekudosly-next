// components/Sidebar.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Menu, X } from 'lucide-react'; // Import icons for mobile toggle

interface SidebarProps {
    activePage?: string;
}

const Sidebar = ({ activePage = "" }: SidebarProps) => {
    const { data: session } = useSession();
    const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [isOpen, setIsOpen] = useState(false); // State to track sidebar visibility on mobile

    const KUDOS_REFRESH_INTERVAL = 24 * 60 * 60 * 1000;

    
    

    const calculateTimeUntilNextRefresh = useCallback(
        (lastKudosRefresh: number | null): number => {
            if (!lastKudosRefresh) {
                return 0;
            }
            const nextRefreshTime = lastKudosRefresh + KUDOS_REFRESH_INTERVAL;
            const timeUntilNextRefresh = nextRefreshTime - Date.now();

            return Math.max(0, timeUntilNextRefresh);
        },
        [],
    )

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
    }, [session?.user?.lastKudosRefresh, calculateTimeUntilNextRefresh]);

    const getLinkClassName = (page: string) => {
        return `flex gap-2 p-2 rounded-lg shadow ${activePage === page
            ? "bg-[#363634] text-white"
            : "bg-[#1B1B1A] hover:bg-[#41413e]"
            }`;
    };

    // Toggle sidebar visibility for mobile
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Mobile Toggle Button - Fixed position outside the sidebar */}
            <button
                className="lg:hidden fixed z-50 bottom-4 left-4 p-3 bg-black rounded-full shadow-lg"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-white" />
                ) : (
                    <Menu className="h-6 w-6 text-white" />
                )}
            </button>

            {/* Sidebar */}
            <aside className={`
                w-64 bg-black p-4 space-y-6 
                fixed lg:static z-40
                h-full
                transition-all duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
            `}>
                {/* Kudos Counter */}
                <div className="p-4 rounded-lg shadow-md text-center bg-[#1B1B1A]">
                    <h2 className="text-lg font-semibold">Kudos: {session?.user?.kudos}</h2>

                    {session?.user?.lastKudosRefresh ? (
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

            {/* Overlay to close sidebar when clicking outside on mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={toggleSidebar}
                    aria-label="Close sidebar"
                />
            )}
        </>
    );
};

export default Sidebar;