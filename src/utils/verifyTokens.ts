import dbConnect from "@/db/db";
import ApiResponse from "@/types/apiResponse";
import { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "jsonwebtoken";
import { User } from "@/model/user.model";
import { generateAccessToken, generateRefreshToken } from "@/utils/tokens";

export default async function verifyTokens(req: NextRequest): Promise<ApiResponse> {
    dbConnect.then().catch((error) => { return Response.json(new ApiResponse(500, false, "database not connected", { error })) })
    try {
        const accessToken = req.cookies.get("accessToken")!
        const refreshToken = req.cookies.get("refreshToken")!
        // const decodeAccess = jwt.verify(accessToken.value, process.env.ACCESS_TOKEN_KEY!)
        const decodeAccess = jwtDecode<JwtPayload & { _id: any, email: string }>(accessToken.value)
        if (!decodeAccess) {
            // const decodeRefresh = jwt.verify(refreshToken.value, process.env.REFRESH_TOKEN_KEY!)
            const decodeRefresh = jwtDecode<JwtPayload & { email: string }>(refreshToken.value)
            if (!decodeRefresh) {
                return new ApiResponse(500, false, "pls login again", {})
            }
            else {
                const email = decodeRefresh.email
                const user = await User.findOne({ email })
                if (!user) {
                    return new ApiResponse(500, false, "token is wrong", {})
                }
                const dbToken = user.refreshToken
                if (dbToken != refreshToken.value) {
                    return new ApiResponse(200, false, "token does not match", {})
                }
                const newAccess = generateAccessToken(user._id, user.email)
                const newRefresh = generateRefreshToken(user.email)
                user.refreshToken = newRefresh
                await user.save({validateBeforeSave: false})
                return new ApiResponse(202, true, "token verified", { email, accessToken: newAccess, refreshToken: newRefresh })
            }
        }
        else {
            return new ApiResponse(200, true, "token verified", { email: decodeAccess.email })
        }
    } catch (error) {
        return new ApiResponse(500, false, "error in token verification", {}, error)
    }
}