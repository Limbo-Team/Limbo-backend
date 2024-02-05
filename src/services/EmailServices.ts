'use strict';
import nodemailer from 'nodemailer';

async function sendEmail({ destinationMail }: { destinationMail: string }) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: true,
    });

    const requestInfo = await transporter.sendMail({
        from: 'test@gmail.com',
        to: destinationMail,
        subject: 'Hello ✔',
        text: 'Hello world?',
        html: '<b>Hello world?</b>',
    });

    console.log('Message sent: %s', requestInfo.messageId);
}

export default sendEmail;
