"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import VideoCard from "@/components/VideoCard";
import Loader from "@/components/Loader";
import { toast } from "sonner";

interface Video {
  _id: string;
  title: string;
  thumbnail: string;
  videoId: string;
  channelName: string;
  duration: string;
  kudosCount: number;
}

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalVideos, setTotalVideos] = useState(0);

  useEffect(() => {
    fetchTrendingVideos();
  }, []);

  const fetchTrendingVideos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/trending");
      if (response.data.success) {
        setVideos(response.data.trendingVideos || []);
        setTotalVideos(response.data.totalCount || 0);
      } else {
        toast.error("Error", {
          description: "Failed to fetch trending videos",
        });
      }
    } catch (error) {
      console.error("Error fetching trending videos:", error);
      toast.error("Error", {
        description: "Failed to fetch trending videos",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen grid grid-rows-[auto,1fr] grid-cols-1">
      {/* Navbar */}
      <Navbar />

      {/* Sidebar + Main Content */}
      <div className="grid grid-cols-[250px,1fr] h-full">
        {/* Sidebar */}
        <Sidebar activePage="trending" />

        {/* Main Content */}
        <main className="p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">
            Trending Videos {totalVideos > 0 && `(${totalVideos})`}
          </h1>

          {loading ? (
            <Loader />
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {videos.map((video) => (
                <div key={video._id} className="flex justify-center">
                  <VideoCard
                    title={video.title}
                    thumbnail={video.thumbnail}
                    channelName={video.channelName}
                    duration={video.duration}
                    videoId={video.videoId}
                    kudosCount={video.kudosCount}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-10">
              No videos found. Be the first to recommend a video!
            </p>
          )}
        </main>
      </div>
    </div>
  );
}