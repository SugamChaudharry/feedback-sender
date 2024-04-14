import {resend} from '@/lib/resend';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiReaponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiReaponse>{
    try {
        resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Feedback sender | verification code',
            react: VerificationEmail({username, otp: verifyCode}),
          });
        return {
            success: true,
            message: "verifiaction email successfully send"
        }
    } catch (emailError) {
        console.log("Error sending verification email", emailError);
        return {
            success: false,
            message: "Failed to send verifiaction email"
        }
    }
}