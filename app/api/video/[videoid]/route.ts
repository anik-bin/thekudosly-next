import connectToDatabase from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import VideoModel from "@/models/Video";

export async function GET(req: NextRequest, props: { params: Promise<{ videoid: string }> }) {
    const params = await props.params;
    await connectToDatabase();

    try {
        const videoId = params.videoid;

        // validate videoid
        if (typeof videoId !== "string" || videoId.length < 5) {
            return NextResponse.json({
                success: false,
                message: "Invalid Video ID format",
            }, {
                status: 400
            });
        }

        // Check if user is authenticated
        const session = await getServerSession(authOptions);
        const user = session?.user;

        // Fetch the video data
        const video = await VideoModel.findOne({ videoId }).populate("submittedBy", "username");

        if (!video) {
            return NextResponse.json({
                success: false,
                message: "Video not found",
            }, {
                status: 404
            });
        }

        // Check if user has given kudos (only if logged in)
        const hasGivenKudos = user
            ? video.appreciatedBy.some((userId) => userId.toString() === user._id)
            : false;

        return NextResponse.json({
            success: true,
            video,
            hasGivenKudos,
        }, {
            status: 200
        });
    /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        console.error("Fetch video error: ", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to fetch video",
        }, {
            status: 500
        });
    }
}