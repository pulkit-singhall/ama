import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db/db";
import ApiResponse from "@/types/apiResponse";
import { signinSchema } from "@/schema/signin.schema";
import { User } from "@/model/user.model";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "@/utils/tokens";
import { verifyTokens } from "@/middlewares/verifyTokens";

export async function POST(req: NextRequest) {
    dbConnect.then((connection) => { }).catch((error) => {
        return Response.json(new ApiResponse(500, false, "database not connected", {error}))
    })

    verifyTokens(req)
    
    try {
        const { email, password } = await req.json()
        signinSchema.parse({ email, password })
        const existUser = await User.findOne({ email })
        if (!existUser) {
            return Response.json(new ApiResponse(412, false, "user not found", {}))
        }
        if (!existUser.isVerified) {
            return Response.json(new ApiResponse(412, false, "user is not verified", {}))
        }
        const result = await bcrypt.compare(password, existUser.password)
        if (!result) {
            return Response.json(new ApiResponse(400, false, "user password is wrong", {}))
        }
        const accessToken = generateAccessToken(existUser._id, existUser.email)
        const refreshToken = generateRefreshToken(existUser._id)
        existUser.refreshToken = refreshToken
        await existUser.save({ validateBeforeSave: false })
        const nextResponse = NextResponse.json(new ApiResponse(200, true, "user logged in", {}))
        nextResponse.cookies.set("accessToken", accessToken, {httpOnly: true, secure: true})
        nextResponse.cookies.set("refreshToken", refreshToken, {httpOnly: true, secure: true})
        return nextResponse
    } catch (error) {
        return Response.json(new ApiResponse(412, false, "user login failed", {}))
    }
}