import { Client, IntentsBitField, MessageCollector, InteractionCollector } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

//bot client with permissions
const client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
    ],
})

export default { client };
