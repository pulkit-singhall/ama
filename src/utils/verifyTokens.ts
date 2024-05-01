import dbConnect from "@/db/db";
import { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "jsonwebtoken";
import { User } from "@/model/user.model";
import { generateAccessToken, generateRefreshToken } from "@/utils/tokens";
import TokenResponse from "@/types/tokenResponse";

export default async function verifyTokens(req: NextRequest): Promise<TokenResponse> {
    dbConnect
        .then((connection) => {})
        .catch((error) => {
            return new TokenResponse(
                500,
                false,
                "database not connected",
                "",
                "",
                ""
            )
        })
    try {
        const accessToken = req.cookies.get("accessToken")
        const refreshToken = req.cookies.get("refreshToken")
        if (!accessToken) {
            if (!refreshToken) {
                return new TokenResponse(
                    500,
                    false,
                    "Pls login again",
                    "",
                    "",
                    ""
                )
            }
            else {
                // const decodeRefresh = jwt.verify(refreshToken.value, process.env.REFRESH_TOKEN_KEY!)
                const decodeRefresh = jwtDecode<
                    JwtPayload & { email: string }>
                (
                    refreshToken.value
                )
                const email = decodeRefresh.email
                const user = await User.findOne({ email })
                if (!user) {
                    return new TokenResponse(
                        500,
                        false,
                        "user not found",
                        "",
                        "",
                        ""
                    )
                }
                const dbToken = user.refreshToken
                if (dbToken != refreshToken?.value) {
                    return new TokenResponse(
                        500,
                        false,
                        "wrong token provided",
                        "",
                        "",
                        ""
                    )
                }
                const newAccess = generateAccessToken(user._id, user.email)
                const newRefresh = generateRefreshToken(user.email)
                user.refreshToken = newRefresh
                await user.save(
                    {
                        validateBeforeSave: false
                    }
                )
                return new TokenResponse(
                    202,
                    true,
                    "tokens re generated",
                    email,
                    newAccess,
                    newRefresh,
                )
            }
        }
        else {
            // const decodeAccess = jwt.verify(accessToken.value, process.env.ACCESS_TOKEN_KEY!)
            const decodeAccess = jwtDecode<
                JwtPayload & { _id: any, email: string }>
            (
                accessToken.value
            )
            return new TokenResponse(
                200,
                true,
                "tokens verified",
                decodeAccess.email,
                "",
                ""
            )
        }
    } catch (error) {
        return new TokenResponse(
            500,
            false,
            "error in token verification",
            "",
            "",
            ""
        )
    }
}