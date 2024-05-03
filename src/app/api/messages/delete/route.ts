import dbConnect from "@/db/db";
import { User } from "@/model/user.model";
import ApiResponse from "@/types/apiResponse";
import verifyTokens from "@/utils/verifyTokens";
import mongoose from "mongoose";
import { M_PLUS_1 } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";

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
        const { _id, content, createdAt } = await req.json()
        const tokenRes = await verifyTokens(req)
        if (!tokenRes.success) {
            return Response.json(
                new ApiResponse(
                    500,
                    false,
                    "token error",
                    {}
                )
            )
        }
        const email = tokenRes.email
        const user = await User.findOne({ email })
        if (!user) {
            return Response.json(
                new ApiResponse(
                    412,
                    false,
                    "user not found",
                    {}
                )
            )
        }
        const messages = user.messages
        let index = -1
        for (let i = 0; i < messages.length; i++){
            const mes = messages[i]
            if (mes.content === content && mes.createdAt === createdAt) {
                index = i
                break
            }
        }
        if (index === -1) {
            return Response.json(
                new ApiResponse(
                    412,
                    false,
                    "message not found",
                    {},
                )
            )
        }
        messages.splice(index, 1)
        user.messages = messages
        await user.save(
            {
                validateBeforeSave: false
            }
        )
        const response = NextResponse.json(
            new ApiResponse(
                200,
                true,
                "message deleted",
                {}
            )
        )
        if (tokenRes.status === 202) {
            response.cookies.set(
                "accessToken",
                tokenRes.access,
                {
                    expires: Date.now() + 60*60*24*1000
                }
            )
            response.cookies.set(
                "refreshToken",
                tokenRes.refresh,
                {
                    expires: Date.now() + 60*60*24*1000*5
                }
            )
        }
        return response
    } catch (error) {
        return Response.json(
            new ApiResponse(
                412,
                false,
                "message not sent",
                {},
                error
            )
        )
    }
}