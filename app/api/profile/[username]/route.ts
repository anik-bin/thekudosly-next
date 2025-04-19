import connectToDatabase from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/User";
import VideoModel from "@/models/Video";

export async function GET(req: NextRequest, props: { params: Promise<{ username: string }> }) {
    const params = await props.params;

    await connectToDatabase();

    const username = params.username;

    // check for authentication

    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({
            success: false,
            message: "Not authenticated",
        }, {
            status: 401
        });
    }

    // find requested profile by username

    const userProfile = await UserModel.findOne({username}).lean();

    if(!userProfile) {
        return NextResponse.json({
            success: false,
            message: "User profile not found",
        }, {
            status: 404
        })
    }

    // find videos recommended by the user

    const recommendedVideos = await VideoModel.find({
        submittedBy: userProfile._id
    }).lean();

    // find videos appreciated by the user

    const appreciatedVideos = await VideoModel.find({
        appreciatedBy: userProfile._id
    }).lean();

    const totalRecommended = recommendedVideos.length;
    const totalAppreciated = appreciatedVideos.length;
    const spentKudos = totalRecommended + totalAppreciated;

    return NextResponse.json({
        success: true,

        profile: {
            _id: userProfile._id.toString(),
            username: userProfile.username,
            email: userProfile.email,
            profilePicture: userProfile.profilePicture || null,
            kudos: userProfile.kudos,
            about: userProfile.about || "",
            spentKudos,
            recommendedCount: recommendedVideos.length,
        },
        recommendedVideos: recommendedVideos.map(video => ({
            _id: video._id.toString(),
            title: video.title,
            thumbnail: video.thumbnail,
            videoId: video.videoId,
            channelName: video.channelName || "YouTube Channel",
            duration: video.duration || "0:00",
        })),
        appreciatedVideos: appreciatedVideos.map(video => ({
            _id: video._id.toString(),
            title: video.title,
            thumbnail: video.thumbnail,
            videoId: video.videoId,
            channelName: video.channelName || "YouTube Channel",
            duration: video.duration || "0:00",
        })),
    })
}