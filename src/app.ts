import("./utils").then((x) => x.loadConfig);
import {
    ChatInputCommandInteraction,
    Client,
    GatewayIntentBits,
} from "discord.js";
import { getHandler } from "./utils";
import { db } from "./db";
import { sql } from "drizzle-orm";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const TOKEN = process.env.DISCORD_BOT_TOKEN!;

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
        await handleChatInputCommand(interaction);
    }
});

client.login(TOKEN);

async function handleChatInputCommand(
    interaction: ChatInputCommandInteraction
) {
    try {
        const x = await db.execute(sql`SELECT * FROM pg_catalog.pg_tables`);
        console.log(x);

        const handler = await getHandler(interaction.commandName);
        await handler(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply(
            "Interaction not found. Ask babishh to fix this."
        );
    }
}
