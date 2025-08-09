import { ATTACHMENTS_DIR, ROOT_DIR } from "../config.js";
import { sendBatch } from "../lib/mailer.js";
import { renderTemplateWithData } from "./render.js";
import path from "path";

export function prepareMails(template, data, attachments = []) {
  const prepared = [];

  if (!Array.isArray(data)) {
    throw new Error("Expected data to be an array.");
  }

  for (const d of data) {
    if (!d.to || !d.subject) {
      console.warn('Skipping entry due to missing "to" or "subject":', d);
      continue;
    }

    const html = renderTemplateWithData(template, d);

    prepared.push({
      originalData: d,
      mailOptions: {
        to: d.to,
        subject: d.subject,
        html,
        attachments: attachments.map((file) => ({
          filename: path.basename(file),
          path: path.resolve(ROOT_DIR, `${ATTACHMENTS_DIR}/${file}`),
        })),
      },
    });
  }

  return prepared;
}

export async function processMails(template, data, attachments = []) {
  try {
    const prepared = prepareMails(template, data, attachments);

    const { failed, success } = await sendBatch(prepared, {
      valueTransFormer: (value) => value.mailOptions,
    });

    return {
      success,
      failed,
    };
  } catch (error) {
    throw error;
  }
}
