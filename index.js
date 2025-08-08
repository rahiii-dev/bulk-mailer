import askConfigurations from "./cli/ask-config.js";
import askProceed from "./cli/ask-proceed.js";
import { saveFailedEmails } from "./utils/file.js";
import { sendBatch } from "./utils/mailer.js";
import prepareMail from "./utils/prepareMail.js";

async function main() {
  const { template, dataFile, attachments } = await askConfigurations();

  const proceed = await askProceed("Proceed with sending emails?");
  if (!proceed) {
    console.log("Operation cancelled by user.");
    process.exit(0);
  }

  const mailData = await prepareMail(template, dataFile, attachments);

  let failedMails = await sendBatch(mailData);

  while (failedMails.length > 0) {
    const file = await saveFailedEmails(failedMails);
    console.log(`\n📄 Saved ${failedMails.length} failed emails to ${file}\n`);

    const retry = await askProceed("Retry sending failed emails?");
    if (!retry) {
      console.log("Operation cancelled by user.");
      process.exit(0);
    }

    failedMails = await sendBatch(failedMails);
  }

  console.log("\n🎉 All emails sent successfully!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
