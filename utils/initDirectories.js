import {
  ATTACHMENTS_DIR,
  DATA_DIR,
  EMAIL_ERROR_DIR,
  GOOGLE_CREDENTIAL_DIR,
  TEMPLATES_DIR
} from "../config.js";
import { createDirectoryIfNotExit } from "./file.js";

export default async function initDirectories() {
  const dirs = [
    TEMPLATES_DIR,
    DATA_DIR,
    ATTACHMENTS_DIR,
    EMAIL_ERROR_DIR,
    GOOGLE_CREDENTIAL_DIR,
  ];

  for (const dir of dirs) {
    const { created, fullPath } = await createDirectoryIfNotExit(dir);
    if (created) {
      console.log(`\n📁 Created: ${fullPath}\n`);
    }
  }
}
