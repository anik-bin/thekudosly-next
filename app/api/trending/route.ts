import connectToDatabase from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import VideoModel from "@/models/Video";

export async function GET(req: NextRequest) {

    await connectToDatabase();
    try {
        const session = await getServerSession(authOptions);

        const user = session?.user;

        if(!user) {
            return NextResponse.json({
                success: false,
                message: "Not authenticated"
            },
            {
                status: 401
            })
        }

        const trendingVideos = await VideoModel.find().sort({ kudosCount: -1, createdAt: -1 }).limit(10);

        return NextResponse.json({
            success: true,
            message: "Trending videos fetched successfully",
            trendingVideos,
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Cannot fetch trending videos"
        },

            {
                status: 500
            }
        )
    }
}