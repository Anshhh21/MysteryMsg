import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";

import { usernameValidation } from "@/schemas/signUpSchema";
import { use } from "react";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParams = {
            username: searchParams.get("username") 
        }

        const result = UsernameQuerySchema.safeParse(queryParams);

        if (!result.success) {

            return Response.json({
                success: false,
                message: "Invalid username format.",
            }, { status: 400 }
            )
        }
        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({
            username: username,
            isVerified: true
        });
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username is already taken.",
            }, { status: 200
            })
        }
        return Response.json({
            success: true,
            message: "Username is available.",
        }, { status: 200
        })
    } catch (error) {
        console.error("Error checking username uniqueness:", error);
        return Response.json({
            success: false,
            message: "Internal server error.",
        }, { status: 500
        })
    }
}


