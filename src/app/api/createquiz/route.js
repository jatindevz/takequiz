import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Usermodel from "@/model/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import QuizModel from "../../../model/quizes.model";
import { extractFromAIResponse, generatePrompt } from "../../../lib/helper";
import axios from "axios";

export async function POST(req) {
    await dbConnect();
    const origin = req.nextUrl.origin;
    try {
        const { topic } = await req.json();
        console.log("Topic: ", topic);

        const session = await getServerSession(authOptions);
        const user = await Usermodel.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Step 1: Generate prompt and call AI API
        const prompt = generatePrompt(topic);
        const res = await axios.post(`${origin}/api/geminiaicall`, { prompt }); // or use full URL depending on deployment
        console.log(res.data.message);
        const quizdata = await extractFromAIResponse({ message: res.data.message });

        console.log("quizdata:", quizdata);

        // Step 2: Format quizdata according to your model
        const formattedQuestions = quizdata.map((item, index) => ({
            questionNo: index + 1,
            question: item.question,
            options: {
                A: item.options.A,
                B: item.options.B,
                C: item.options.C,
                D: item.options.D,
            },
            correctAnswer: item.correctAnswer,
            explanation: item.explanation,
            userAnswer: "",
            isCorrect: false,
        }));

        // Step 3: Save into DB
        const quiz = await QuizModel.create({
            user: user._id,
            topic: topic,
            quizQue: formattedQuestions,
            student: []
        });

        console.log("Saved Quiz:", quiz._id);

        return NextResponse.json({ message: "Quiz created successfully", quizId: quiz._id }, { status: 200 });

    } catch (err) {
        console.error("Error creating quiz:", err);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
