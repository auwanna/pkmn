import { confirm, select } from "@inquirer/prompts";
import { getMons } from "@/features/pokeapi/utils/requests";

const request = await select({
  choices: [
    {
      description: "Retrieve all pokemon and some additional data from pokeapi",
      name: "Get Pokemon",
      value: "get-mons",
    } as const,
    {
      description:
        "Retrieve all regions and the total number of pokemon in each",
      name: "Get Regions",
      value: "get-regions",
    } as const,
  ],
  message: "Choose a function",
});

await prompt();

async function prompt() {
  switch (request) {
    case "get-mons": {
      await getMons();
      break;
    }
    default:
      return;
  }

  const answer = await confirm({ message: "Continue?" });
  if (answer) {
    await prompt();
  }
}
