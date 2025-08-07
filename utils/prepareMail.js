import { ATTACHMENTS_DIR, DATA_DIR, ROOT_DIR, TEMPLATES_DIR } from "../config.js";
import { readFileFromRoot } from "./file.js";
import { renderTemplateWithData } from "./render.js";
import path from 'path';

export default async function prepareMails(templateFile, dataFile, attachments = []) {
  const mailData = [];

  try {
    const templatePath = path.join(TEMPLATES_DIR, templateFile);
    const dataPath = path.join(DATA_DIR, dataFile);

    const templateStr = await readFileFromRoot(templatePath);
    const dataJson = await readFileFromRoot(dataPath);
    const data = JSON.parse(dataJson);

    if (!Array.isArray(data)) {
      throw new Error('Expected data file to contain an array of entries.');
    }

    for (const d of data) {
      if (!d.to || !d.subject) {
        console.warn('Skipping entry due to missing "to" or "subject":', d);
        continue;
      }

      const html = renderTemplateWithData(templateStr, d);

      mailData.push({
        to: d.to,
        subject: d.subject,
        html,
        attachments: attachments.map(file => ({
          filename: path.basename(file),
          path: path.resolve(ROOT_DIR, `${ATTACHMENTS_DIR}/${file}`),
        })),
      });
    }

    return mailData;
  } catch (error) {
    console.error('❌ Failed to prepare mails:', error.message);
    throw error; 
  }
}
