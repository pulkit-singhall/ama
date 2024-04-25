import dbConnect from "@/db/db";
import ApiResponse from "@/types/apiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    dbConnect.then((connection) => { }).catch((error) => {
        return Response.json(new ApiResponse(500, false, "database not connected", {}), {status: 500})
    })
    try {
        const response = NextResponse.json(new ApiResponse(200, true, "user logged out", {}), {status: 200})
        response.cookies.set("accessToken", "", {httpOnly: true, secure: true, expires: Date.now()})
        response.cookies.set("refreshToken", "", { httpOnly: true, secure: true, expires: Date.now()})
        return response
    } catch (error) {
        return Response.json(new ApiResponse(500, false, "error in logout", {}, error), {status: 500})
    }
}