'use strict';
import nodemailer from 'nodemailer';
import handleError from '../utils/handleError';

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

        await transporter.sendMail({
            from: 'limbo@gmail.com',
            to: destinationMail,
            subject: 'Veryfication code',
            text: 'Hello world?',
            html: `<b>Twój kod: ${resetCode}</b>
            <p>Wprowadź ten kod w aplikacji, aby zresetować hasło. Pamiętaj, że kod jest aktywny tylko<b> 5 minut. </b></p>
            <p>Jeśli to nie Ty, zignoruj tę wiadomość.</p>
            <p>Pozdrawiamy, zespół Limbo</p>`,
        });
    } catch (error) {
        throw handleError(error, (error as any).message);
    }
}

export default sendEmail;
