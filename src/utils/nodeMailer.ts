import ApiResponse from "@/types/apiResponse";
import nodemailer from "nodemailer"
import { nodeMailerTemplate } from "../../email/nodeMailerTemplate";

const myEmail = process.env.EMAIL
const password = process.env.EMAIL_PASSWORD

const transport = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: myEmail,
            pass: password
        }
    }
)

export async function sendNodeMail(
    username: string,
    email: string,
    verifyCode: string):
    Promise<ApiResponse> {
    try {
        const mailOptions :any = {
            from: myEmail,
            to: email,
            subject: 'Verification of Email',
            text: 'Verify your email through the given code',
            html: nodeMailerTemplate(username, verifyCode),
        }
        await transport.sendMail(mailOptions)
        return new ApiResponse(
            200,
            true,
            "Mail sent",
            {}
        ) 
    } catch (error) {
        return new ApiResponse(
            500,
            false,
            "Mail sending failed",
            {}
        )
    }
}