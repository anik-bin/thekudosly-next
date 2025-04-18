"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import VideoRecommendation from "@/components/VideoRecommendation";

export default function Recommend() {
    return (
        <>
            <div className="h-screen grid grid-rows-[auto,1fr] grid-cols-1">
                {/* Navbar */}
                <Navbar />

                {/* Sidebar + Main Content */}
                <div className="grid grid-cols-[250px,1fr] h-full">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
                    <main className="flex justify-center h-full">
                        <div className="max-w-2xl w-full">
                            <div className="flex flex-col h-full">
                                {/* Left Column - Text about recommend video */}
                                <div className="p-4">
                                    <h1 className="text-4xl font-bold mt-2">Recommend a Video</h1>
                                    <p className="mt-2 text-gray-600 text-sm">
                                        Share your favorite videos with the community by recommending them here!
                                    </p>
                                    <ol className="mt-6 text-slate-400 list-disc list-inside text-sm">
                                        <li>Just paste the YouTube link and create a preview before publishing.</li>
                                        <li>You can recommend any video on YouTube.</li>
                                        <li>1 Kudos is required to recommend a video</li>
                                    </ol>
                                </div>

                                {/* Right Column - Video Recommendation Component */}
                                <div>
                                    <VideoRecommendation />
                                </div>
                            </div>
                        </div>
                        
                    </main>
                </div>
            </div>
        </>
    )
}