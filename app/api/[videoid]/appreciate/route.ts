import connectToDatabase from "@/lib/db";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/User";
import VideoModel from "@/models/Video";

export async function POST(req: NextRequest, { params }: { params: { videoid: string } }) {

    await connectToDatabase();
    try {

        // get video id from url
        const videoId = params.videoid;

        // Check if the video ID is valid MongoDB ObjectId
        if (typeof videoId !== "string" || videoId.length < 5) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid video ID format",
                },
                { status: 400 }
            );
        }

        // check if user is authenticated or not

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

        // check if user exists in database or not

        const existingUser = await UserModel.findById(user?._id);

        if (!existingUser) {
            return NextResponse.json({
                success: false,
                message: "User not found",
            },
                {
                    status: 404
                }
            )

        }

        // check if user has enough kudos to give

        if (existingUser?.kudos < 1) {
            return NextResponse.json({
                success: false,
                message: "Insufficient kudos"
            },
                {
                    status: 400
                }
            )
        }

        // check if video exists in database or not

        const existingVideo = await VideoModel.findOne({ videoId });

        if (!existingVideo) {
            return NextResponse.json({
                success: false,
                message: "Video not found"
            },
                {
                    status: 404
                }
            )
        }

        // add user to appreciatedBy array of video and increase kudos count by 1

        existingVideo.appreciatedBy.push(existingUser._id);
        existingVideo.kudosCount += 1;

        await existingVideo.save();

        return NextResponse.json({
            success: true,
            message: "Kudos given successfully",
        },
            {
                status: 200
            }
        )
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Could not give kudos",
        },
            {
                status: 500
            })
    }
}