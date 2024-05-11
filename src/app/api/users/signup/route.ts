import { sendNodeMail } from "@/utils/nodeMailer";
import dbConnect from "@/db/db";
import { User } from "@/model/user.model";
import ApiResponse from "@/types/apiResponse";
import { signupSchema } from "@/schema/signup.schema";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    dbConnect
        .then((connection) => {})
        .catch((error) => {
            return Response.json(
                new ApiResponse(
                    500,
                    false,
                    "database not connected",
                    {}
                )
            )
        })

    try {
        const { username, email, password } = await req.json()
        signupSchema.parse({
            username,
            email,
            password
        })
        const existingUserByEmail = await User.findOne({ email })
        if (existingUserByEmail) {
            return Response.json(
                new ApiResponse(
                    400,
                    false,
                    "email already exists",
                    {}
                )
            )
        }
        const userByUsername = await User.findOne({
            username,
            isVerified: true
        })
        if (userByUsername) {
            return Response.json(new ApiResponse(
                400,
                false,
                "username already exists",
                {}
            )
            )
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
            return Response.json(
                new ApiResponse(
                    500,
                    false,
                    "internal error in creating the user",
                    {}
                )
            )
        }
        const emailResult = await sendNodeMail(
            username,
            email,
            verifyEmailCode
        )
        if (!emailResult.success) {
            await User.deleteOne({ email })
            return Response.json(
                new ApiResponse(
                    500,
                    false,
                    "error in sending verification email",
                    {}
                )
            )
        }
        return Response.json(
            new ApiResponse(
                201,
                true,
                "user registered successfully",
                { signupUser }
            )
        )
    } catch (error) {
        return Response.json(
            new ApiResponse(
                412,
                false,
                "user not registered",
                {},
                error
            )
        )
    }
}