"use client";
import Sidebar from "@/components/Sidebar";
import NavbarPreview from "@/components/Navbar-preview";
import Link from "next/link";

export default function Contact() {


    return (
        <>
            <div className="grid grid-rows-[auto,1fr] grid-cols-1">
                {/* Navbar */}
                <NavbarPreview />

                {/* Sidebar + Main Content */}
                <div className="grid grid-cols-[250px,1fr] h-full">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
                    <div className="flex flex-col gap-4 justify-center items-center p-10">
                        <h1 className="text-4xl font-bold">Contact Us</h1>
                        <div className="flex flex-col gap-4 bg-[#5e5e5e] p-6 mb-6 rounded-lg">
                            <h1>Email: me[@]aniketbindhani.com</h1>
                            <div className="flex flex-row gap-4">
                                <Link href="https://x.com/aniketbindhani" target="_blank" rel="noopener noreferrer"><img width="30" height="30" src="https://img.icons8.com/ios-filled/50/twitterx--v2.png" alt="twitterx--v2" className=" transition-transform hover:scale-105" /></Link>
                                <Link href="https://www.linkedin.com/in/aniket-bindhani/" target="_blank" rel="noopener noreferrer"><img width="30" height="30" src="https://img.icons8.com/ios-filled/50/linkedin.png" alt="linkedin" className=" transition-transform hover:scale-105" /></Link>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}