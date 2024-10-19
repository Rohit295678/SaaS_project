import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

const model = genAi.getGenerativeModel({
     model: 'gemini-1.5-flash',
    })


export async function POST(req: Request){
    try {
        const { userId } = auth();
        const  body  = await req.json();
        const { messages } = body;
        if(!userId){
            return new NextResponse("Unauthorised",{status: 400})
        }

        if(!messages){
            return new NextResponse("Please Ask Question",{status: 401});
        }
        //const result = await model.generateContent('What is the sum of the first 50 prime numbers?')
        // const result = await model.generateContent({
        //     contents: [
        //       {
        //         role: 'user',
        //         parts: [
        //           {
        //             text: messages[0].code
        //           },
        //         ],
        //       },
        //     ],
        //     // Setting it on the generateContentStream request.
        //     tools: [
        //       {
        //         codeExecution: {},
        //       },
        //     ],
        //   });
        // we can do alternate way in the using startChat model and passing the further appropriate description to it

        const chat = model.startChat({
            tools: [
              {
                codeExecution: {},
              },
            ],
          });

          const result = await chat.sendMessage(
            messages[0].code +
            "Please generate code to compute this in the above mentioned programming language"
          );
          

        const response = result.response;
        return  NextResponse.json({ role:"assistant", code: response.text() })

    } catch (error) {
        console.log("ERROR in Code generation", error);
        return new NextResponse("Internal Server Error",{status: 500});
    }
}