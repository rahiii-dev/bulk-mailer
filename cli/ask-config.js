import inquirer from "inquirer";
import { DATA_DIR, TEMPLATES_DIR, ATTACHMENTS_DIR } from "../config.js";
import { getFilenamesFromDir } from "../utils/file.js";

export default async function () {
  // 1. Pick Template
  const templateList = await getFilenamesFromDir(TEMPLATES_DIR, ".html");
  if (!templateList.length) {
    console.error("No templates found in", TEMPLATES_DIR);
    process.exit(1);
  }

  const { template } = await inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: "Select template:",
      choices: templateList,
    },
  ]);

  // 2. Ask data source
  const { source } = await inquirer.prompt([
    {
      type: "list",
      name: "source",
      message: "Select data source:",
      choices: [
        { name: "Google Sheet", value: "google" },
        { name: "Local JSON File", value: "file" },
      ],
    },
  ]);
  
  const data = {
    source,
    dataFilePath: null
  }

  //3. Pick Data
  if(source === "file"){
    data.dataFilePath = await getFilenamesFromDir(DATA_DIR, ".json");
    if (!dataList.length) {
      console.error("No data files found in", DATA_DIR);
      process.exit(1);
    }
    const { dataFile } = await inquirer.prompt([
      {
        type: "list",
        name: "dataFile",
        message: "Select data file:",
        choices: dataList,
      },
    ]);
  }

  //4. Select Attachments
  const attachmentList = await getFilenamesFromDir(ATTACHMENTS_DIR, ".pdf");
  if (!attachmentList.length) {
    console.warn(
      "No attachments found in",
      ATTACHMENTS_DIR,
      "- proceeding without attachments."
    );
    return {
      template,
      data,
      attachments: [],
    };
  }
  const { attachments } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "attachments",
      message: "Select attachment(s):",
      choices: attachmentList,
    },
  ]);

  return {
    template,
    data,
    attachments,
  };
}
