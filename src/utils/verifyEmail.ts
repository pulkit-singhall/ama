import { Resend } from 'resend';
import dotenv from "dotenv";
import EmailTemplate from "../../email/emailVerifyComponent";
import ApiResponse from '@/types/apiResponse';

dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY);

export const verifyEmail = async (
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> => {
    try {
        const data = await resend.emails.send(
            {
                from: 'Acme <onboarding@resend.dev>',
                to: email,
                subject: 'Verification of Email',
                react: EmailTemplate(
                    username,
                    verifyCode
                ),
            }
        );
        return new ApiResponse(
            200,
            true,
            "email sent",
            {
                data
            }
        )
    }
    catch (error) {
        return new ApiResponse(
                500,
                false,
                "email not sent",
                {},
                error
            )
        }
}