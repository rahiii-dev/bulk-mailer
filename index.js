import askConfigurations from "./cli/ask-config.js";
import askProceed from "./cli/ask-proceed.js";
import { saveFailedEmails } from "./utils/file.js";
import getTemplateAndData from "./utils/getTemplateAndData.js";
import { sendBatch } from "./lib/mailer.js";
import { processMails } from "./utils/mail-helpers.js";
import { updateMailResults } from "./utils/sheet-helpers.js";

async function main() {
  const { template, data, attachments } = await askConfigurations();

  console.log("\nPreparing mail....\n");

  const {templateData, templateStr} = await getTemplateAndData(template, data);

  const proceed = await askProceed("Proceed with sending emails?");
  if (!proceed) {
    console.log("Operation cancelled by user.");
    process.exit(0);
  }
  
  const result = await processMails(templateStr, templateData, attachments);

  // Update sheet or save failed file
  if (data.source === "google") {
    await updateMailResults(result);
  } else {
    let failedMails = result.failed;

    if (failedMails.length > 0) {
      const file = await saveFailedEmails(failedMails);
      console.log(
        `\n📄 Saved ${failedMails.length} failed emails to ${file}\n`
      );
    }

    // Retry loop for failed mails
    while (failedMails.length > 0) {
      const retry = await askProceed("Retry sending failed emails?");
      if (!retry) {
        console.log("Operation cancelled by user.");
        process.exit(0);
      }
      const {failed} = await sendBatch(failedMails);
      failedMails = failed;
    }
  }

  console.log("\n🎉 All emails sent successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
