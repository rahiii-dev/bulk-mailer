import fs from "fs/promises";
import path from "path";
import { EMAIL_ERROR_DIR, ROOT_DIR } from "../config.js";

/**
 * Load files with a given extension from a directory relative to project root.
 * @param {string} dir - Directory path relative to project root
 * @param {string} format - File extension (e.g., '.html', '.json')
 * @returns {Promise<string[]>} - Array of file names
 */
export async function getFilenamesFromDir(dir, format) {
  const targetDir = path.resolve(ROOT_DIR, dir);
  const files = await fs.readdir(targetDir);

  return files.filter((f) => f.endsWith(format));
}

/**
 * Reads a file from the root directory and returns its content as string.
 * @param {string} relativePath - The relative path from ROOT_DIR
 * @returns {Promise<string>}
 */
export async function readFileFromRoot(relativePath) {
  const filePath = path.resolve(ROOT_DIR, relativePath);
  return await fs.readFile(filePath, "utf-8");
}

/**
 * Save failed email data to a JSON file for retrying later.
 * Ensures the error directory exists before writing.
 * @param {Array} failedMails - Array of mail objects that failed to send
 * @returns {Promise<string|undefined>} The saved file path
 */
export async function saveFailedEmails(failedMails) {
  if (!Array.isArray(failedMails) || failedMails.length === 0) {
    return;
  }

  const errorsDir = path.resolve(ROOT_DIR, EMAIL_ERROR_DIR);

  await fs.mkdir(errorsDir, { recursive: true });

  const dateStr = new Date().toISOString().split("T")[0]; 
  const fileName = `failed-${dateStr}.json`;
  const filePath = path.join(errorsDir, fileName);

  try {
    await fs.writeFile(filePath, JSON.stringify(failedMails, null, 2), "utf-8");
    return filePath;
  } catch (err) {
    console.error(`\n❌ Could not save failed emails: ${err.message}\n`);
  }
}
