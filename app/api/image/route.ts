import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro"});


export async function POST(req: Request){
    try {
        const {userId} = auth();
        const  body  = await req.json()
        const { prompt, amount=1, resolution="512x512" } = body;
        if(!userId){
            return new NextResponse("Unauthorised", {status: 401});
        }

        if(!prompt){
            return new NextResponse("Must Send Data",{status: 405});
        }
        if(!amount){
            return new NextResponse("Must Send Data",{status: 405});
        }
        if(!resolution){
            return new NextResponse("Must Send Data",{status: 405});
        }

        //const prompt = data.prompt;

        const response = await model.generateContent(
            prompt);

    } catch (error) {
        console.log("Error in image generation", error)
        return new NextResponse("Internal Server Error",{status: 500});
    }
}