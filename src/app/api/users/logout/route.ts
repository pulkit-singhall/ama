import dbConnect from "@/db/db";
import ApiResponse from "@/types/apiResponse";
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
                    {},
                    error,
                )
            )
        })
    try {
        const response = NextResponse.json(
            new ApiResponse(
                200,
                true,
                "user logged out",
                {}
            )
        )
        response.cookies.set(
            "accessToken",
            "",
            {
                expires: Date.now()
            }
        )
        response.cookies.set(
            "refreshToken",
            "",
            {
                expires: Date.now()
            }
        )
        return response
    } catch (error) {
        return Response.json(
            new ApiResponse(
                500,
                false,
                "error in logout",
                {},
                error
            )
        )
    }
}