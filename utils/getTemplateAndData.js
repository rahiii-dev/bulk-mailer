import path from "path";
import { DATA_DIR, DATA_SHEET_NAME, SHEET_ID, TEMPLATES_DIR } from "../config.js";
import { readFileFromRoot } from "./file.js";
import { readSheetData } from "../lib/google/googleSheets.js";
import { headerTransformer } from "../lib/google/transformer.js";
import { rowFilter } from "../lib/google/filter.js";

export default async function getTemplateAndData(templateFile, data) {
  try {
    const templatePath = path.join(TEMPLATES_DIR, templateFile);
    const templateStr = await readFileFromRoot(templatePath);
    let templateData = null;

    if (data.source === "google") {
      templateData = await readSheetData(SHEET_ID, DATA_SHEET_NAME, {
        transformer: headerTransformer,
        filter: rowFilter,
      });
    } else {
      const dataPath = path.join(DATA_DIR, data.dataFilePath);
      const dataJson = await readFileFromRoot(dataPath);
      templateData = JSON.parse(dataJson);
    }

    return {templateStr, templateData};
  } catch (error) {
    throw error;
  }
}
