// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import OpenAI from "openai";


// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });


// export async function POST(req: Request){
//   try {

//     const {userId} = auth();
//     const body = await req.json();
//     const { messages } = body

//     if(!userId){
//         return new NextResponse("Unauthorized",{status: 401});
//     }

//     if(!openai.apiKey){
//         return new NextResponse("OPENAI Key not Configured",{status: 500})
//     }

//     if(!messages){
//         return new NextResponse("Messages are Required",{status: 400});
//     }

//     const completion = await openai.chat.completions.create({
//         model: "gpt-4o-mini",
//         messages
//     });

//     return  NextResponse.json(completion.choices[0].message);
    
//   } catch (error) {
//     console.log("[Conversation ERROR]",error)
//     return new NextResponse("Internal error",{status: 500})
//   }
// }

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// const client = new TextServiceClient({
//     apiKey: process.env.GOOGLE_API_KEY, // Ensure this environment variable is set correctly
// });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // if (!client.apiKey) {
    //     return new NextResponse("Google API Key not Configured", { status: 500 });
    // }

    if (!messages) {
        return new NextResponse("Messages are Required", { status: 400 });
    }

    // Create the prompt based on the messages
    const prompt = messages.map((msg: { role: string, content: string }) => {
        return `${msg.role}: ${msg.content}`;
    }).join("\n");

    // Make the request to the Gemini model
    // const [response] = await client.generateText({
    //     model: "gemeni-1.5-flash",
    //     prompt: prompt,
    // });

    const result = await model.generateContent(prompt);
    const response = await result.response;
  const text = response.text();
  

    //const message = response.candidates?.[0]?.output || "No response generated";

    return NextResponse.json({ role:"assistant", content: text });

  } catch (error) {
    console.log("[Conversation ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


