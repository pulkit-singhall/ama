import { NextRequest } from "next/server";
import ApiResponse from "@/types/apiResponse";
import dbConnect from "@/db/db";
import { emailCollectSchema } from "@/schema/emailCollect";
import { User } from "@/model/user.model";
import { sendNodeMail } from "@/utils/nodeMailer";

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
        }
    )
    
    try {
        const { email } = await req.json()
        emailCollectSchema.parse(email)
        const existUser = await User.findOne({ email })
        if (!existUser) {
            return Response.json(
                new ApiResponse(
                    412,
                    false,
                    "user not found",
                    {}
                )
            )
        }
        const verifyEmailCode = Math.floor(100000 + Math.random() * 900000).toString()
        const verifyEmailCodeExpiry = Date.now() + 900000
        existUser.verifyEmailCode = verifyEmailCode
        existUser.verifyEmailCodeExpiry = verifyEmailCodeExpiry
        await existUser.save({
            validateBeforeSave: false
        })
        const emailRes = await sendNodeMail(
            existUser.username,
            email,
            verifyEmailCode
        )
        if (!emailRes.success) {
            return Response.json(
                new ApiResponse(
                    500,
                    false,
                    "internal server error in sendin the mail",
                    {},
                )
            )
        }
        return Response.json(
            new ApiResponse(
                200,
                true,
                "verification mail sent",
                {},
            )
        )
    } catch (error) {
        return Response.json(
            new ApiResponse(
                500,
                false,
                "internal server error",
                {},
                error
            )
        )
    }
}