// app/(app)/contact/page.tsx
"use client";
import Sidebar from "@/components/Sidebar";
import NavbarPreview from "@/components/Navbar-preview";
import Link from "next/link";

export default function Contact() {
    return (
        <div className="h-screen grid grid-rows-[auto,1fr] grid-cols-1">
            {/* Navbar */}
            <NavbarPreview />

            {/* Sidebar + Main Content */}
            <div className="flex h-full overflow-hidden">
                {/* Sidebar */}
                <Sidebar activePage="contact" />

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-10 overflow-y-auto flex flex-col items-center justify-center">
                    <h1 className="text-2xl sm:text-4xl font-bold mb-6">Contact Us</h1>
                    <div className="flex flex-col gap-4 bg-[#5e5e5e] p-6 mb-6 rounded-lg w-full max-w-md">
                        <h2 className="text-sm sm:text-base">Email: me[@]aniketbindhani.com</h2>
                        <div className="flex flex-row gap-4">
                            <Link href="https://x.com/aniketbindhani" target="_blank" rel="noopener noreferrer">
                                <img
                                    width="30"
                                    height="30"
                                    src="https://img.icons8.com/ios-filled/50/twitterx--v2.png"
                                    alt="twitterx--v2"
                                    className="transition-transform hover:scale-105"
                                />
                            </Link>
                            <Link href="https://www.linkedin.com/in/aniket-bindhani/" target="_blank" rel="noopener noreferrer">
                                <img
                                    width="30"
                                    height="30"
                                    src="https://img.icons8.com/ios-filled/50/linkedin.png"
                                    alt="linkedin"
                                    className="transition-transform hover:scale-105"
                                />
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}