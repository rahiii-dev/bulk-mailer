import { google } from "googleapis";
import path from "path";
import fs from "fs";
import { GOOGLE_CREDENTIAL_FILE, ROOT_DIR } from "../../config.js";

// Load service account credentials
const credentialsPath = path.resolve(ROOT_DIR, GOOGLE_CREDENTIAL_FILE);
const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));

// Authenticate
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Create sheets API client
export async function getSheet() {
  const client = await auth.getClient();
  return google.sheets({ version: "v4", auth: client });
}

/**
 * Read Google Sheet data as JSON with optional transforms and filtering.
 *
 * @param {string} sheetName - Name of the sheet
 * @param {object} options
 * @param {object} [options.transforms] - { headerName: transformFunction }
 * @param {function} [options.filter] - Function to filter rows (receives row object)
 */
export async function readSheetData(sheetId, range, options = {}) {
  const { transforms = {}, filter = null } = options;

  const sheets = await getSheet();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    return [];
  }

  const headers = rows[0];

  let data = rows.slice(1).map((row) => {
    let obj = {};
    headers.forEach((header, index) => {
      const key = header.toLowerCase();
      let value = row[index] || "";

      if (transforms[key]) {
        value = transforms[key](value);
      }

      obj[key] = value;
    });
    return obj;
  });

  if (typeof filter === "function") {
    data = data.filter(filter);
  }

  return data;
}

/**
 * Update rows in a Google Sheet
 * @param {string} sheetId - The spreadsheet ID
 * @param {string} range - The range (e.g., "Sheet1!A1")
 * @param {Array[]} values - 2D array of data to write
 */
export async function updateSheet(sheetId, range, values) {
  const sheets = await getSheet();

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values,
    },
  });
}

/**
 * Append rows in a Google Sheet
 * @param {string} sheetId - The spreadsheet ID
 * @param {string} range - The range (e.g., "Sheet1!A1")
 * @param {Array[]} values - 2D array of data to write
 */
export async function appendSheet(sheetId, range, values) {
  const sheets = await getSheet();

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values,
    },
  });
}

/**
 * clear rows in a Google Sheet
 * @param {string} sheetId - The spreadsheet ID
 * @param {string} range - The range (e.g., "Sheet1!A1")
 */
export async function clearSheet(sheetId, range) {
  const sheets = await getSheet();

  await sheets.spreadsheets.values.clear({
    spreadsheetId: sheetId,
    range,
  });
}
