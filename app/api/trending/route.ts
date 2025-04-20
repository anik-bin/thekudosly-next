import connectToDatabase from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import VideoModel from "@/models/Video";

export async function GET(req: NextRequest) {
    await connectToDatabase();
    try {
        // Fetch trending videos sorted by kudos count and then creation date
        const trendingVideos = await VideoModel.find()
            .sort({ kudosCount: -1, createdAt: -1 })
            .limit(30);

        // Get the total count of videos in the database
        const totalCount = await VideoModel.countDocuments();

        return NextResponse.json({
            success: true,
            message: "Trending videos fetched successfully",
            trendingVideos,
            totalCount
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Cannot fetch trending videos"
        },
            {
                status: 500
            });
    }
}