import OpenAI from "openai";

import { NextResponse } from "next/server";


    const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    });
    
    export const runtime = "edge";
    
    export async function POST(request: Request) {
        try {
            const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? ||If you could have dinner with any historical figure, who would it be?! What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment•"
        
        
            const response = await openai.responses.create({
                model: "gpt-4.1-mini",
                input: prompt,
            });

            const text = response.output_text;

            return NextResponse.json({ text });
            
        } catch (error) {
            if (error instanceof OpenAI.APIError){
                const {name , message, status} = error;
                return NextResponse.json({
                    name,
                    message,
                    success: false
                }, { status
                })

            }else {
                console.error("Error generating suggestion:", error);
                return Response.json({
                    message: "Internal Server Error",
                    success: false
                }, { status: 500 });
            }
        }

}
