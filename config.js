import dotenv from "dotenv";
dotenv.config();

export const ROOT_DIR = process.cwd();
export const TEMPLATES_DIR = "./templates";
export const DATA_DIR = "./data";
export const ATTACHMENTS_DIR = "./attachments";


export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = Number(process.env.SMTP_PORT);
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;
export const SMTP_SECURE = process.env.SMTP_SECURE || "true";
export const SMTP_USER_NAME = process.env.SMTP_USER_NAME;

export const SHEET_ID = process.env.SHEET_ID;
export const DEFAULT_DATA_FILE = process.env.DEFAULT_DATA_FILE;
export const DEFAULT_RESUME_PATH = process.env.DEFAULT_RESUME_PATH;
export const SHEET_RANGE = "Sheet1!A:D";


