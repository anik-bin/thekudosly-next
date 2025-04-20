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
import { useRouter } from "next/navigation";

interface VideoDetails {
    videoId: string;
    title: string;
    thumbnail: string;
    channelName: string;
    videoUrl: string;
    duration: string;
    description: string;
}

export default function VideoRecommendation() {
    const router = useRouter();
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
            const { videoId, title, thumbnail, channelName, duration, description } = response.data;

            setVideoDetails({ videoId, title, thumbnail, channelName, videoUrl: url, duration, description });

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
                duration: videoDetails?.duration,
                channelName: videoDetails?.channelName,
                description: videoDetails?.description,
            });

            toast.success("Success", {
                description: response.data.message,
            });

            setUrl("");
            setVideoDetails(null);

            router.push(`/video/yt/${videoDetails?.videoId}`);
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
        <div className="w-full p-4 sm:p-6">
            <label htmlFor="video-url" className="text-sm text-slate-400">Video URL</label>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center mt-2">
                    <Input
                        id="video-url"
                        type="text"
                        placeholder="Enter YouTube video URL"
                        {...form.register("youtubeVideoLink")}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full sm:w-2/3"
                        disabled={loading}
                    />
                    <Button
                        onClick={handlePreview}
                        disabled={loading}
                        className="w-full sm:w-auto bg-white text-black hover:bg-slate-100"
                    >
                        {loading ? "Loading..." : "Preview"}
                    </Button>
                </div>

                {loading && <Loader />}

                {videoDetails && (
                    <div className="space-y-4">
                        <div className="flex justify-center sm:justify-start">
                            <VideoCard
                                thumbnail={videoDetails.thumbnail}
                                title={videoDetails.title}
                                channelName={videoDetails.channelName}
                                duration={videoDetails.duration}
                                videoId={videoDetails.videoId}
                            />
                        </div>
                        <Button
                            className="w-full sm:w-auto rounded-sm p-4 sm:p-6 bg-white text-black hover:bg-slate-100"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Recommending..." : "Recommend Video and Give Kudos"}
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}