import nodemailer from 'nodemailer';
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_USER_NAME } from '../config.js';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: { user: SMTP_USER, pass: SMTP_PASS }
});

export async function sendEmail(mailOptions) {
  return transporter.sendMail({
    from: `${SMTP_USER_NAME}`,
    ...mailOptions
  });
}