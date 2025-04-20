// app/(app)/recommend/page.tsx
"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import VideoRecommendation from "@/components/VideoRecommendation";

export default function Recommend() {
    return (
        <div className="h-screen grid grid-rows-[auto,1fr] grid-cols-1">
            {/* Navbar */}
            <Navbar />

            {/* Sidebar + Main Content */}
            <div className="flex h-full overflow-hidden">
                {/* Sidebar */}
                <Sidebar activePage="recommend" />

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex flex-col">
                            {/* Text about recommend video */}
                            <div className="p-4">
                                <h1 className="text-2xl sm:text-4xl font-bold mt-2">Recommend a Video</h1>
                                <p className="mt-2 text-gray-600 text-sm">
                                    Share your favorite videos with the community by recommending them here!
                                </p>
                                <ol className="mt-6 text-slate-400 list-disc list-inside text-sm">
                                    <li>Just paste the YouTube link and create a preview before publishing.</li>
                                    <li>You can recommend any video on YouTube.</li>
                                    <li>1 Kudos is required to recommend a video</li>
                                </ol>
                            </div>

                            {/* Video Recommendation Component */}
                            <div>
                                <VideoRecommendation />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}