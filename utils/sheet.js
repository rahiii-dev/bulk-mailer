import fs from 'fs/promises';
import { google } from 'googleapis';
import { SHEET_ID, SHEET_RANGE } from './config.js';

async function getSheetsClient() {
  const creds = JSON.parse(await fs.readFile('creds.json', 'utf-8'));
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  return google.sheets({ version: 'v4', auth });
}

export async function logToSheet({ timestamp, company, role, email }) {
  const sheets = await getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: SHEET_RANGE,
    valueInputOption: 'RAW',
    requestBody: { values: [[timestamp, company, role, email]] }
  });
}
