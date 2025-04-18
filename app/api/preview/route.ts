import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { extractYoutubeVideoID } from "@/lib/extractYoutubeVideoID";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

function formatDuration(duration: string) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = match?.[1] ? match[1].replace("H", "") : "00";
    const minutes = match?.[2] ? match[2].replace("M", "") : "00";
    const seconds = match?.[3] ? match[3].replace("S", "") : "00";
    return `${hours !== "00" ? hours + ":" : ""}${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export async function POST(req: NextRequest) {
    try {
        const { videoUrl } = await req.json();

        const session = await getServerSession(authOptions);

        const user = session?.user;

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Not authenticated"
            },
                {
                    status: 401
                })
        }

        const extractedVideoId = extractYoutubeVideoID(videoUrl);

        if (!extractedVideoId) {
            return NextResponse.json({
                success: false,
                message: "Invalid video URL"
            },
                { status: 400 }
            );
        }

        // fetch the video details from YouTube API

        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
            params: {
                part: "snippet, contentDetails",
                id: extractedVideoId,
                key: process.env.YOUTUBE_API_KEY
            }
        })

        if (response.data.items.length === 0) {
            return NextResponse.json({
                success: false,
                message: "Video not found"
            },
                {
                    status: 404
                }
            )
        }

        const videoDetailsReceived = response.data.items[0].snippet;
        const videoThumbnail = videoDetailsReceived.thumbnails.maxres?.url || videoDetailsReceived.thumbnails.default.url;
        const videoContentsReceived = response.data.items[0].contentDetails;
        const videoDuration = formatDuration(videoContentsReceived.duration);
        const videoDescription = videoDetailsReceived.description || "";

        return NextResponse.json({
            success: true,
            message: "Video fetched successfully",
            videoId: extractedVideoId,
            thumbnail: videoThumbnail,
            title: videoDetailsReceived.title,
            channelName: videoDetailsReceived.channelTitle,
            duration: videoDuration,
            description: videoDescription,
        }, {
            status: 200
        })
    } catch (error: any) {
        console.log("Preview video error:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to fetch video preview"
        }, { status: 500 });
    }
}