import dbConnect from "@/db/db";
import ApiResponse from "@/types/apiResponse";
import { User } from "@/model/user.model";
import { verifyCodeSchema } from "@/schema/verifycode.schema";
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
        const { verifyEmailCode, email } = await req.json()
        verifyCodeSchema.parse({
            code: verifyEmailCode,
            email
        })
        const userByEmail = await User.findOne({ email })
        if (!userByEmail) {
            return Response.json
                (new ApiResponse(
                    412,
                    false,
                    "user does not exist",
                    {}
                ),
            )
        }
        if (userByEmail.isVerified) {
            return Response.json(
                new ApiResponse(
                    412,
                    false,
                    "user is already verified",
                    {}
                ),
            )
        }
        const username = userByEmail.username
        const userByUsername = await User.findOne({
            username,
            isVerified: true
        })
        if (userByUsername) {
            await User.deleteOne({ email })
            return Response.json(
                new ApiResponse(
                    402,
                    false,
                    "username already taken, pls signup with a different username and password",
                    {}
                )
            )
        }
        if (
            userByEmail.verifyEmailCode !== verifyEmailCode ||
            userByEmail.verifyEmailCodeExpiry < Date.now()
        ) {
            await User.deleteOne({ email })
            return Response.json(
                new ApiResponse(
                    412,
                    false,
                    "code is wrong or expired",
                    {}
                )
            )
        }
        userByEmail.isVerified = true
        userByEmail.verifyEmailCode = ""
        userByEmail.verifyEmailCodeExpiry = -1
        await userByEmail.save({
            validateBeforeSave: false
        })
        return Response.json(
            new ApiResponse(
                200,
                true,
                "user verified successfully",
                {}
            )
        )
    } catch (error) {
        return Response.json(
            new ApiResponse(
                412,
                false,
                "error in verification",
                {}
            )
        )
    }
}