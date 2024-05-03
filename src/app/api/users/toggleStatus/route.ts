import dbConnect from "@/db/db"
import { User } from "@/model/user.model"
import ApiResponse from "@/types/apiResponse"
import verifyTokens from "@/utils/verifyTokens"
import { NextRequest } from "next/server"

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
                    error
                )
            )
        })
    
    try {
        const tokenRes = await verifyTokens(req)
        if (!tokenRes.success) {
            return Response.json(
                new ApiResponse(
                    500,
                    false,
                    `token error: ${tokenRes.message}`,
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
        const status = user.isAcceptingMessages
        user.isAcceptingMessages = !status
        await user.save(
            {
                validateBeforeSave: false
            }
        )
        return Response.json(
            new ApiResponse(
                200,
                true,
                "status toggled",
                {}
            )
        )
    } catch (error) {
        return Response.json(
            new ApiResponse(
                500,
                false,
                "status not toggled",
                {},
                error
            )
        )
    }
}