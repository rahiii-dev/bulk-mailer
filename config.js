import dotenv from "dotenv";
dotenv.config();
import { getOrThrow } from "./utils/env.js";

export const ROOT_DIR = process.cwd();
export const TEMPLATES_DIR = "./templates";
export const DATA_DIR = "./data";
export const ATTACHMENTS_DIR = "./attachments";
export const EMAIL_ERROR_DIR = DATA_DIR + "/errors";


export const SMTP_HOST = getOrThrow("SMTP_HOST");
export const SMTP_PORT = getOrThrow("SMTP_PORT", Number);
export const SMTP_USER = getOrThrow("SMTP_USER");
export const SMTP_PASS = getOrThrow("SMTP_PASS");
export const SMTP_SECURE = process.env.SMTP_SECURE || "true";
export const SMTP_USER_NAME = getOrThrow("SMTP_USER_NAME");

// google sheet
export const GOOGLE_CREDENTIAL_FILE =  "lib/google/credential/cred.json";
export const SHEET_ID = getOrThrow("SHEET_ID");
export const DATA_SHEET_NAME = getOrThrow("DATA_SHEET_NAME");
export const COMPLETED_SHEET_NAME = getOrThrow("COMPLETED_SHEET_NAME");





