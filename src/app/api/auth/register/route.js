import dbConnect from "@/lib/database";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { signIn } from "next-auth/react";
import { NextResponse } from "next/server";

export async function POST(req) {
    await dbConnect();

    try {
        const { username, email, password } = await req.json();

        // ✅ Validate required fields
        if (!username || !email || !password) {
            console.log("All fields are required.");
            return NextResponse.json(
                { success: false, message: "All fields are required." },
                { status: 400 }
            );
        }

        // ❌ Check for existing email
        const existingEmailUser = await UserModel.findOne({ email });
        if (existingEmailUser) {
            return NextResponse.json(
                { success: false, message: "Email is already registered." },
                { status: 400 }
            );
        }

        // 🔐 Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 📝 Save new user
        const newUser = await UserModel.create({
            username,
            email,
            password: hashedPassword,
        });

        // const res = await signIn('credentials', {
        //                 redirect: false,
        //                 email,
        //                 password,
        //             });

        // ✅ Return success
        return NextResponse.json({
            success: true,
            message: "User registered successfully.",
            userId: newUser._id,
        });
        
    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json(
            { success: false, message: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
