import { COMPLETED_SHEET_NAME, DATA_SHEET_NAME, SHEET_ID } from "../config.js";
import {
  appendSheet,
  clearSheet,
  updateSheet,
} from "../lib/google/googleSheets.js";

function extractOriginalDataValues(data) {
  if (!Array.isArray(data) || data.length === 0) return [];
  const keys = Object.keys(data[0].originalData);
  return data.map((item) => keys.map((key) => item.originalData[key] ?? ""));
}

export async function updateMailResults({ success, failed }) {
  try {
    if (success.length > 0) {
      const values = extractOriginalDataValues(success);
      await appendSheet(SHEET_ID, `${COMPLETED_SHEET_NAME}`, values);
    }

    if (failed.length > 0) {
      const values = extractOriginalDataValues(failed);
      await updateSheet(SHEET_ID, `${DATA_SHEET_NAME}!A2`, values);
    } else {
      await clearSheet(SHEET_ID, `${DATA_SHEET_NAME}!A2:ZZZ`);
    }
  } catch (error) {
    console.log("Failed to update sheet");
    throw error;
  }
}
