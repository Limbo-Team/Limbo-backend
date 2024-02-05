'use strict';
import nodemailer from 'nodemailer';
import ApplicationError from '../utils/ApplicationError';
import { StatusCodes } from 'http-status-codes';

async function sendEmail({ destinationMail, resetCode }: { destinationMail: string; resetCode: number }) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: '0f2ff33b3aea15',
                pass: '7682a97792826e',
            },
        });

        const requestInfo = await transporter.sendMail({
            from: 'test@gmail.com',
            to: destinationMail,
            subject: 'Hello ✔',
            text: 'Hello world?',
            html: `<b>Twój kod: ${resetCode}</b>`,
        });

        console.log('Message sent: %s', requestInfo.messageId);
    } catch (error) {
        throw new ApplicationError('Email not sent', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export default sendEmail;
