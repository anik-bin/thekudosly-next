import connectToDatabase from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse, userAgent } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/User";

export async function POST(req: NextRequest) {
    await connectToDatabase();

    try {
       // check for authentication
       
        const session = await getServerSession(authOptions);

        const user = session?.user;

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not authenticated",
                },
                { status: 401 }
            );
        }

        const existingUser = await UserModel.findById(user?._id);

        const {about} = await req.json();

        if(typeof about !== "string") {
            return NextResponse.json({
                success: false,
                message: "Invalid request body",
            }, {
                status: 401
            });
        }

        await UserModel.findByIdAndUpdate(
            existingUser?._id,
            {
                $set: { about: about },
            },
            {new: true}
        )

        return NextResponse.json({
            success: true,
            message: "About section updated successfully",
        });
    } catch (error: any) {
        console.error("Update about section error:", error);

        return NextResponse.json({
            success: false,
            message: error.message || "Failed to update the about section",
        }, {
            status: 500
        });
    }
}