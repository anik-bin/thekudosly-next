"use client";
import React, { useEffect, useState } from 'react'
import NavbarPreview from '@/components/Navbar-preview';
import { useParams, useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import VideoDescription from '@/components/VideoDescription';

interface VideoData {
    _id: string;
    title: string;
    description: string;
    videoId: string;
    channelName: string;
    thumbnail: string;
    kudosCount: number;
    submittedBy: {
        _id: string;
        username: string;
    };
}

const VideoPreviewPage = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [videoData, setvideoData] = useState<VideoData | null>(null);
    const [hasGivenKudos, setHasGivenKudos] = useState(false);
    const [givingKudos, setGivingKudos] = useState(false);

    const videoId = params?.videoid as string;

    useEffect(() => {
        if (!session || !session.user) return;

        const fetchVideoData = async () => {
            try {
                const response = await axios.get(`/api/video/${videoId}`);
                setvideoData(response.data.video);
                setHasGivenKudos(response.data.hasGivenKudos);
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                const errorMessage = axiosError.response?.data.message;

                toast.error("Error", {
                    description: errorMessage || "Could not fetch video data",
                });


                // redirect to dashboard

                if (axiosError.response?.status === 404) {
                    router.push("/");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchVideoData();
    }, [session, videoId, router]);

    const handleGiveKudos = async () => {
        if (hasGivenKudos || !session?.user || !videoData) return;

        setGivingKudos(true);

        try {
            const response = await axios.post(`/api/${videoId}/appreciate`);

            setHasGivenKudos(true);
            setvideoData((prev) =>
                prev ? { ...prev, kudosCount: prev.kudosCount + 1 } : null);

            toast.success("Success", {
                description: "Kudos given successfully!",
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;

            toast.error("Error", {
                description: errorMessage || "Could not give kudos",
            });
        } finally {
            setGivingKudos(false);
        }
    };

    if (loading) {
        return (
            <div>
                <NavbarPreview />
                <div className="container mx-auto mt-8 p-4 flex justify-center">
                    <Loader />
                </div>
            </div>
        );
    }

    if (!videoData) {
        return (
            <div>
                <NavbarPreview />
                <div className="container mx-auto mt-8 p-4">
                    <h1 className="text-2xl font-bold">Video not found</h1>
                </div>
            </div>
        );
    }

    return (
        <div>
            <NavbarPreview />
            <div className="container mx-auto mt-8 p-4 px-40">
                {/* Video Player */}
                <div className="max-w-4xl mx-auto mb-10">
                    <div className="aspect-w-16 aspect-h-9">
                        <iframe
                            className='rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.5)]'
                            src={`https://www.youtube.com/embed/${videoData.videoId}`}
                            title={videoData.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    {/* Video Title */}

                    <h1 className="text-3xl font-bold mt-10 mb-2">{videoData.title}</h1>

                    {/* Channel Name */}
                    <p className="text-lg text-gray-500 mb-4">
                        Channel: {videoData.channelName}
                    </p>

                    {/* Kudos Section */}
                    <div className="flex justify-between items-center mb-6 mt-6 bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center">
                            <span className="text-xl mr-2"><Image src="/icon.png" alt="icon" width={32} height={32} /></span>
                            <span className="text-2xl font-semibold">{videoData.kudosCount}</span>
                        </div>
                        <Button
                            onClick={handleGiveKudos}
                            disabled={hasGivenKudos || givingKudos || session?.user.kudos === 0}
                            className="bg-white text-black hover:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            {givingKudos ? "Processing..." : hasGivenKudos ? "Kudos Given 🔒" : "Give Kudos"}
                        </Button>
                    </div>

                    {/* Recommended By */}
                    <p className="text-sm text-gray-500 mb-6">
                        Recommended by: @{videoData.submittedBy.username}
                    </p>

                    {/* Video Description */}
                    <div className="mt-4">
                        <h2 className="text-2xl font-semibold mb-2">Description</h2>
                        <VideoDescription description={videoData.description} />
                    </div>
                </div> 
            </div>
        </div>
    );
}

export default VideoPreviewPage;