//src/app/api/getquiz/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Usermodel from "@/model/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import QuizModel from "../../../model/quizes.model";
import axios from "axios";

export async function POST(req) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);
        const user = await Usermodel.findOne({ email: session.user.email });

        const { quizid, name, email } = await req.json();

        console.log("quizid: ", quizid);

        const quiz = await QuizModel.findById(quizid);

        if (!quiz) {
            console.log("Quiz nor found");
            return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
        }

        // Optional: Prevent duplicates
        const alreadyExists = quiz.student.find((s) => s.email === email);
        if (alreadyExists) {
            return NextResponse.json({ message: "Student already exists in quiz" }, { status: 409 });
        }

        // Push new student entry
        quiz.student.push({
            name,
            email,
            score: 0
        });

        await quiz.save();

        return NextResponse.json({ message: "Student added successfully", studentid: quiz.student.at(-1)._id.toString(), quiz }, { status: 200 });

    } catch (error) {
        console.error("getquiz failed", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req) {
    await dbConnect();
    try {
        const quizid = req.nextUrl.searchParams.get("quizid"); // ✅ use this instead
        // console.log("quizid: ", quizid);
        console.log("quizid: ", quizid);
        const quiz = await QuizModel.findById(quizid);
        console.log("quiz: ", quiz.quizQue);
        return NextResponse.json({ message: "Quiz found", topic: quiz.topic , quizQue: quiz.quizQue }, { status: 200 });
    } catch (error) {
        console.error("getquiz failed", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}