import inquirer from "inquirer";

export default async function askProceed(message) {
  const { proceed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "proceed",
      message,
      default: true,
    },
  ]);

  return proceed;
}
