import fs from 'fs/promises';
import path from 'path';
import { ROOT_DIR } from '../config.js';

/**
 * Load files with a given extension from a directory relative to project root.
 * @param {string} dir - Directory path relative to project root
 * @param {string} format - File extension (e.g., '.html', '.json')
 * @returns {Promise<string[]>} - Array of file names
 */
export async function getFilenamesFromDir(dir, format) {
  
  const targetDir = path.resolve(ROOT_DIR, dir);
  const files = await fs.readdir(targetDir);

  return files.filter(f => f.endsWith(format));
}

/**
 * Reads a file from the root directory and returns its content as string.
 * @param {string} relativePath - The relative path from ROOT_DIR
 * @returns {Promise<string>}
 */
export async function readFileFromRoot(relativePath) {
  const filePath = path.resolve(ROOT_DIR, relativePath);
  return await fs.readFile(filePath, 'utf-8');
}