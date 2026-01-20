import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/User";

import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const {username, email, password} = await request.json()
        const existingUserVerifyByUsername =await UserModel.findOne({ 
            username,
            isVerified: true
        })

        if( existingUserVerifyByUsername){
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken.",
                },
                { status: 400 }
            )
        }

        const existingUserVerifyByEmail = await UserModel.findOne({ 
            email,
            isVerified: true
        })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        if( existingUserVerifyByEmail){
            if(existingUserVerifyByEmail.isVerified){
                return Response.json(
                    {
                        success: false,
                        message: "Email is already registered.",
                    },
                    { status: 400 }
                )
            }
            else {
                //update existing unverified user with new details
                const hashedPassword = await bcrypt.hash(password, 10)

                existingUserVerifyByEmail.username = username;
                existingUserVerifyByEmail.password = hashedPassword;
                existingUserVerifyByEmail.verifyCode = verifyCode;
                existingUserVerifyByEmail.verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

                await existingUserVerifyByEmail.save();
            } 
        }else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified:false,
                    isAcceptingMessages: true,
                    messages: []
            })
            await newUser.save();  
        }

        //send verification email

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        if(!emailResponse.success){
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            )
        }
        return Response.json(
            {
                success: true,
                message: "User registered successfully. Verification email sent.",
            },
            { status: 201 }
        )

    } catch (error) {
        console.error("Error registering user", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error during registration.",
            },
            { status: 500 }
        )
    }
}