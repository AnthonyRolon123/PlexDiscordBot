import dotenv from "dotenv";
dotenv.config();
import { REST, Routes } from "discord.js";

const commands = [
  {
    name: "skip",
    description: "Skip the current movie",
  },
  {
    name: "resume",
    description: "Resume movie",
  },
  {
    name: "pause",
    description: "Pause movie",
  },
  {
    name: 'play',
    description: 'Play a movie'
  },
  {
    name: 'start',
    description: 'Start or refresh the queue of movies playing'
  },
  {
    name: 'search',
    description: 'Search for a movie'
  },
  {
    name: 'now',
    description: 'See what movie is playing'
  }
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");

    // await rest.put(
    //   Routes.applicationCommands(
    //     process.env.CLIENT_ID,
    //   ),
    //   { body: commands }
    // );

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("Slash commands were registered successfully!");
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();
