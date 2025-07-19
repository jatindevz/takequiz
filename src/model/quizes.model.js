//src/model/quizes.model.js

import mongoose, { Schema } from "mongoose";


const quizQueSchema = new Schema({
    questionNo: Number,
    question: String,
    options: {
        A: String,
        B: String,
        C: String,
        D: String
    },
    correctAnswer: String,
    userAnswer: String,
    isCorrect: Boolean,
    explanation: String
    
}, { _id: false });

const studentSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    score: { type: Number, default: 0 }
});

// Main schema referencing User
const TypeObjectSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        topic: { type: String, required: true },
        quizQue: { type: [quizQueSchema], default: [] }, 
        student: { type: [studentSchema], default: [] }
    },
    { timestamps: true }
);

const QuizModel = mongoose.models.Quiz || mongoose.model('Quiz', TypeObjectSchema);

export default QuizModel;