import { verifyEmail } from "@/utils/verifyEmail";
import dbConnect from "@/db/db";
import { User } from "@/model/user.model";
import ApiResponse from "@/types/apiResponse";
import { signupSchema } from "@/schema/signup.schema";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    dbConnect.then((connection) => {
    }).catch((error) => {
        return Response.json({ error, detail: "error in database connection" })
    })

    try {
        const { username, email, password } = await req.json()
        signupSchema.parse({ username, email, password })
        const existingUserByEmail = await User.findOne({ email })
        if (existingUserByEmail) {
            return Response.json(new ApiResponse(400, false, "email already exists", {}), { status: 400 })
        }
        const userByUsername = await User.findOne({ username, isVerified: true })
        if (userByUsername) {
            return Response.json(new ApiResponse(400, false, "username already exists", {}), { status: 400 })
        }
        const verifyEmailCode = Math.floor(100000 + Math.random() * 900000).toString()
        const verifyEmailCodeExpiry = Date.now() + 900000
        const signupUser = await User.create({
            email,
            username,
            password,
            isVerified: false,
            messages: [],
            verifyEmailCodeExpiry, // 15 minutes validity
            verifyEmailCode,
            refreshToken: "",
            forgotPasswordCode: "",
            forgotPasswordCodeExpiry: -1,
        })
        if (!signupUser) {
            return Response.json(new ApiResponse(500, false, "internal error in creating the user", {}), { status: 500 })
        }
        const emailResult = await verifyEmail(email, username, verifyEmailCode)
        if (!emailResult.success) {
            await User.deleteOne({ email })
            return Response.json(new ApiResponse(500, false, "error in sending verification email", {}), { status: 500 })
        }
        return Response.json(new ApiResponse(201, true, "user registered successfully", { signupUser }), { status: 201 })
    } catch (error) {
        return Response.json(new ApiResponse(412, false, "user not registered", {}, error), { status: 412 })
    }
}