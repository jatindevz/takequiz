// pages/api/geminiaicall/route.ts

import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";


const ai = new GoogleGenAI({});

export async function POST(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST requests allowed' });
    }

    try {
        const { prompt } = await req.json();
        console.log("Prompt:", prompt);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ text: prompt }],
            config: {
                thinkingConfig: {
                    thinkingBudget: 0, // Disables thinking
                },
            }
        });
        console.log(response.text);

        return NextResponse.json({ message: response.text }, { status: 200 });
        
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Internal Server Error yaha se hai textmsg" }, { status: 500 });
    }
}

