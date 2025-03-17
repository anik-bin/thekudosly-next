import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

const Sidebar = () => {

    const {data: session} = useSession();
    return (
        <aside className="p-4 space-y-6">
            {/* Kudos Counter */}
            <div className="p-4 rounded-lg shadow-md text-center bg-gray-800">
                <h2 className="text-lg font-semibold">Kudos</h2>
                <p className="text-xl font-bold">{session?.user.kudos}</p>
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
                <Button variant="destructive" className="w-full" onClick={()=> signOut()}>
                    Logout
                </Button>
            </nav>
        </aside>
    )
}

export default Sidebar