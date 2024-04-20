import { Resend } from 'resend';
import dotenv from "dotenv";
import EmailTemplate from "../../email/emailVerifyComponent";

dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY);

export const verifyEmail = async (email: string, username: string, verifyCode: string) => {
    try {
        const data = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification of Email',
            react: EmailTemplate(username, verifyCode),
        });
        return Response.json({data, message: "verification email sent to the user"});
    } catch (error) {
        return Response.json({ error });
    }
}