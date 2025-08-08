import nodemailer from "nodemailer";
import pLimit from "p-limit";
import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_USER_NAME,
} from "../config.js";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

export async function sendEmail(mailOptions) {
  return transporter.sendMail({
    from: `${SMTP_USER_NAME}`,
    ...mailOptions,
  });
}

export async function sendBatch(mails, options={}) {
  const { concurrency = 5, log = false } = options;

  const limit = pLimit(concurrency);
  const failed = [];

  await Promise.all(
    mails.map((mail) =>
      limit(async () => {
        try {
          await sendEmail(mail);
          if (log) console.log(`✅ Sent to ${mail.to}`);
        } catch (err) {
          failed.push(mail);
        }
      })
    )
  );

  return failed;
}
