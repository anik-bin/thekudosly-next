import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { extractYoutubeVideoID } from "@/lib/extractYoutubeVideoID";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

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
                part: "snippet",
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

        return NextResponse.json({
            success: true,
            message: "Video fetched successfully",
            videoId: extractedVideoId,
            thumbnail: videoThumbnail,
            title: videoDetailsReceived.title,
            channelName: videoDetailsReceived.channelTitle,
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