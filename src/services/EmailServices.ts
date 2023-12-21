import { Resend } from 'resend';
import ApplicationError from '../utils/ApplicationError';
import { StatusCodes } from 'http-status-codes';
const resend = new Resend('re_MMbwqXQ7_AaxtLJ7cVhoyLYfaLxHVTaf6');

class EmailService {
    async sendEmail(email: string, code: number) {
        const data = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Hello World',
            html: `<strong>${code}</strong>`,
        });
        if (data.error) {
            throw new ApplicationError('Email not sent', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default EmailService;
