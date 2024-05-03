import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db/db";
import ApiResponse from "@/types/apiResponse";
import verifyTokens from "@/utils/verifyTokens";
import { User } from "@/model/user.model";

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
        // verify tokens
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
        const response = NextResponse.json(
            new ApiResponse(
                200,
                true,
                "user details fetched",
                {user}
            )
        )
        if (tokenRes.status === 202) {
            response.cookies.set(
                "accessToken",
                tokenRes.access,
                {
                    httpOnly: true,
                    secure: true,
                    expires: Date.now() + 60*60*24*1000
                }
            )
            response.cookies.set(
                "refreshToken",
                tokenRes.refresh,
                {
                    httpOnly: true,
                    secure: true,
                    expires: Date.now() + 60*60*24*1000*5
                }
            )
        }
        return response
    } catch (error) {
        return Response.json(
            new ApiResponse(
                500, 
                false,
                "some error in fetching profile",
                {},
                error
            )
        )
    }
}