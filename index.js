import askConfigurations from "./cli/ask-config.js";
import askProceed from "./cli/ask-proceed.js";
import { sendEmail } from "./utils/mailer.js";
import prepareMail from "./utils/prepareMail.js";
import fs from "fs";
import path from "path";

const logFile = path.resolve("email-log.txt");

async function main() {
  const { template, dataFile, attachments } = await askConfigurations();

  const proceed = await askProceed("Proceed with sending emails?");
  if (!proceed) {
    console.log("Operation cancelled by user.");
    process.exit(0);
  }

  const mailData = await prepareMail(template, dataFile, attachments);

  for (const mail of mailData) {
    try {
      const info = await sendEmail(mail);
      const successMsg = `✅ Email sent to ${mail.to} - Message ID: ${info.messageId}\n`;
      console.log(successMsg);
    } catch (error) {
      const errorMsg = `❌ Failed to send email to ${mail.to} - Error: ${error.message}\n`;
      console.error(errorMsg);
      fs.appendFileSync(logFile, errorMsg);
    }
  }

  console.log(`\n📄 Log written to: ${logFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
