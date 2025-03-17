import { youtubeVideoLinkVerificationSchema } from "@/schemas/youtubeVideoLinkVerficationSchema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "./Loader";
import VideoCard from "./VideoCard";


interface VideoDetails {
    videoId: string;
    title: string;
    thumbnail: string;
    channelName: string;
    videoUrl: string;
    duration: string;
}

export default function VideoRecommendation() {
    const [url, setUrl] = useState("");
    const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof youtubeVideoLinkVerificationSchema>>({
        resolver: zodResolver(youtubeVideoLinkVerificationSchema),
    });

    // Handle video preview
    const handlePreview = async () => {
        setLoading(true);
        try {
            const response = await axios.post("/api/preview", { videoUrl: url });
            const { videoId, title, thumbnail, channelName, duration } = response.data;

            setVideoDetails({ videoId, title, thumbnail, channelName, videoUrl: url, duration});

            toast.success("Preview created", {
                description: "Check the video details below.",
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;

            toast.error("Preview creation failed", {
                description: errorMessage || "An error occurred while fetching preview",
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle video recommendation
    const onSubmit = async (data: z.infer<typeof youtubeVideoLinkVerificationSchema>) => {
        setLoading(true);
        try {
            const response = await axios.post<ApiResponse>("/api/recommend", {
                videoUrl: videoDetails?.videoUrl,
                videoId: videoDetails?.videoId,
                thumbnail: videoDetails?.thumbnail,
                title: videoDetails?.title,
            });

            toast.success("Success", {
                description: response.data.message,
            });

            setUrl("");
            setVideoDetails(null);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;

            toast.error("Video Recommendation failed", {
                description: errorMessage || "An error occurred",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 mt-8">
            <label htmlFor="" className="text-sm text-slate-400">Video URL</label>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex items-center space-x-2 mt-2">
                    <Input
                        type="text"
                        placeholder="Enter YouTube video URL"
                        {...form.register("youtubeVideoLink")}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-1/2"
                        disabled={loading}
                    />
                    <Button onClick={handlePreview} disabled={loading} className="w-40 bg-white text-black hover:bg-slate-100">
                        {loading ? "Loading..." : "Preview"}
                    </Button>
                </div>

                {loading && <Loader />}

                {videoDetails && (
                    <>
                        <div className="mt-4 flex justify-start">
                            <VideoCard
                                thumbnail={videoDetails.thumbnail}
                                title={videoDetails.title}
                                channelName={videoDetails.channelName}
                                duration={videoDetails.duration}
                            />
                        </div>
                        <Button
                            className="w-1/2 rounded-sm p-6 bg-white text-black hover:bg-slate-100 mt-4"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Recommending..." : "Recommend Video and Give Kudos"}
                        </Button>
                    </>
                )}
            </form>
        </div>
    );
}