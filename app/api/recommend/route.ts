import VideoModel from "@/models/Video";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { extractYoutubeVideoID } from "@/lib/extractYoutubeVideoID";
import axios from "axios";
import connectToDatabase from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
    await connectToDatabase();

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

        // find user in database

        const existingUser = await UserModel.findById(user?._id);

        if (!existingUser) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }

        if (existingUser?.kudos < 1) {
            return NextResponse.json({
                success: false,
                message: "Insufficient kudos"
            }, {
                status: 400
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

        // check if video already exists in database

        const existingVideo = await VideoModel.findOne({
            videoId: extractedVideoId
        });

        if (existingVideo) {
            return NextResponse.json({
                success: false,
                message: "The video has already been recommended",
            },
                {
                    status: 409
                }
            )
        }

        // if everything is ok then fetch the video details from YouTube API

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

        // save the video to the database

        existingUser.kudos -= 1;

        const newVideo = await VideoModel.create({
            videoUrl: videoUrl,
            videoId: extractedVideoId,
            title: videoDetailsReceived.title,
            thumbnail: videoThumbnail,
            submittedBy: existingUser._id

        });

        await existingUser.save();

        return NextResponse.json({
            success: true,
            message: "Video recommended successfully",
            video: newVideo
        },
            {
                status: 201
            }
        )
    } catch (error: any) {
        console.log("Recommend video error:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Recommend video failed"
        }, 
        {
            status: 500
        }
    )

    }
}