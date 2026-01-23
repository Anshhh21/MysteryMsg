import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user: User = session?.user 

    if (!session || !session.user) {
        return Response.json({
            message: "Unauthorized",
            success: false
        }, { status: 401 });
    }

    const userId = user.id;

    const {acceptMessages} = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessages: acceptMessages }, { new: true });

        if(!updatedUser){
            return Response.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }
        return Response.json({
            message: "Message preferences updated successfully",
            success: true,
            updatedUser
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error updating message preferences:", error);
        return Response.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 });
        
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user: User = session?.user 

    if (!session || !session.user) {
        return Response.json({
            message: "Unauthorized",
            success: false
        }, { status: 401 });
    }

    const userId = user.id;

    try {
        const foundUser = await UserModel.findById(userId)
    
        if(!foundUser){
            return Response.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }
        return Response.json({
            message: "User message preferences retrieved successfully",
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessages
        }, { status: 200 });
    } catch (error) {
        console.error("Error retrieving message preferences:", error);
        return Response.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 });
    }
}