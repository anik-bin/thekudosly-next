import VideoModel from "@/models/Video";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
    await connectToDatabase();

    try {
        const { videoUrl, videoId, thumbnail, title, channelName, description, duration } = await req.json();

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

        const existingVideo = await VideoModel.findOne({
            videoId: videoId,
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


        existingUser.kudos -= 1;

        const newVideo = await VideoModel.create({
            videoUrl,
            videoId,
            thumbnail,
            title,
            channelName,
            description,
            duration,
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