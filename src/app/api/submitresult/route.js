//src/app/api/submitresult/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import QuizModel from "../../../model/quizes.model";



export async function POST(req) {
    await dbConnect();

    console.log("submitresult called");
    

    try {
        const { quizid, studentid, score, } = await req.json();
        console.log("quizid: ", quizid);
        console.log("studentid: ", studentid);
        const quiz = await QuizModel.findById(quizid);
        if (!quiz) {
            console.log("Quiz nor found");
            return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
        }
        const student = quiz.student.find((s) => s._id.toString() === studentid);
        if (!student) {
            console.log("Student not found in quiz");
            return NextResponse.json({ message: "Student not found in quiz" }, { status: 404 });
        }
        student.score = score;
        await quiz.save();
        return NextResponse.json({ message: "Result submitted successfully" }, { status: 200 });
    } catch (error) {
        console.error("submitresult failed", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });

    }
}

export async function GET(req) {
    await dbConnect();

    try {
        const quizid = req.nextUrl.searchParams.get("quizid"); // ✅ use this instead
        console.log("quizid: ", quizid);
        const quiz = await QuizModel.findById(quizid);
        console.log("quiz: ", quiz.student);
        return NextResponse.json({ message: "Quiz found", students: quiz.student, topic: quiz.topic, questionCount: quiz.quizQue.length }, { status: 200 });
    } catch (error) {
        console.error("getquiz failed", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}