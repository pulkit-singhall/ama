import dbConnect from "@/db/db";
import ApiResponse from "@/types/apiResponse";
import { User } from "@/model/user.model";
import { verifyCodeSchema } from "@/schema/verifycode.schema";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    dbConnect.then((connection) => { }).catch((error) => { return Response.json({ error, detail: "error in database connection" }) })
    try {
        const { verifyEmailCode, email } = await req.json()
        const userByEmail = await User.findOne({ email })
        verifyCodeSchema.parse({ code: verifyEmailCode, email })
        if (!userByEmail) {
            return Response.json(new ApiResponse(412, false, "user does not exist", {}), { status: 412 })
        }
        if (userByEmail.isVerified) {
            return Response.json(new ApiResponse(200, true, "user is already verified", {}), { status: 200 })
        }
        const username = userByEmail.username
        const userByUsername = await User.findOne({ username, isVerified: true })
        if (userByUsername) {
            await User.deleteOne({ email })
            return Response.json(new ApiResponse(402, false, "username already taken, pls signup with a different username and password", {}), { status: 402 })
        }
        if (userByEmail.verifyEmailCode !== verifyEmailCode || userByEmail.verifyEmailCodeExpiry < Date.now()) {
            await User.deleteOne({ email })
            return Response.json(new ApiResponse(412, false, "code is wrong or expired", {}), { status: 412 })
        }
        userByEmail.isVerified = true
        userByEmail.verifyEmailCode = ""
        userByEmail.verifyEmailCodeExpiry = -1
        await userByEmail.save({ validateBeforeSave: false })
        return Response.json(new ApiResponse(200, true, "user verified successfully", {}), { status: 200 })
    } catch (error) {
        return Response.json(new ApiResponse(412, false, "error in verification", {}), { status: 412 })
    }
}