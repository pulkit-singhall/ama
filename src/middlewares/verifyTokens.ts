import dbConnect from "@/db/db";
import ApiResponse from "@/types/apiResponse";
import { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

export const verifyTokens = (req: NextRequest) => {
    dbConnect.then().catch((error) => { return Response.json(new ApiResponse(500, false, "database not connected", { error })) })
    try {
        const accessToken = req.cookies.get("accessToken")!
        const refreshToken = req.cookies.get("refreshToken")!
        // const decodeAccess = jwt.verify(accessToken.value, process.env.ACCESS_TOKEN_KEY!)
        const decodeAccess = jwtDecode(accessToken.value)
        if (!decodeAccess) {
            // const decodeRefresh = jwt.verify(refreshToken.value, process.env.REFRESH_TOKEN_KEY!)
            const decodeRefresh = jwtDecode(refreshToken.value)
            if (!decodeRefresh) {
                return new ApiResponse(500, false, "pls login again", {})
            }
            else {
                        
            }
        }
        else {
            return new ApiResponse(200, true, "token verified", {})   
        }
    } catch (error) {
        return new ApiResponse(500, false, "error in token verification", {error})
    }
}