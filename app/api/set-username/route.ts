import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserModel from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { usernameVerificationSchema } from "@/schemas/usernameVerificationSchema";

export async function POST(req: NextRequest) {

    try {
        await connectToDatabase();
    
        const session = await getServerSession(authOptions)
    
        if (!session || !session.user) {
            return NextResponse.json({
                success: false,
                message: "Not authenticated"
            }, {
                status: 401
            })
        }
    
        const { username } = await req.json();
        
        try {
            usernameVerificationSchema.parse({ username });
        } catch (validationError: any) {
            return NextResponse.json({
                success: false,
                message: validationError.errors?.[0]?.message || "Invalid username format"
            }, { status: 400 });
        }
        
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return NextResponse.json({
                success: false,
                message: "Username already taken"
            }, { status: 400 });
        }
    
        // Update user
        await UserModel.findOneAndUpdate(
            { email: session.user.email },
            { username }
        );

        return NextResponse.json({
            success: true,
            message: "Username set successfully"
        });
    } catch (error: any) {
        console.error("Set username error:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "An unexpected error occurred"
        }, { status: 500 });
    }
    
}