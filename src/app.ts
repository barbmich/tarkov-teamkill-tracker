import "./dotenv";
import { env } from "./env";
import {
    ChatInputCommandInteraction,
    Client,
    GatewayIntentBits,
} from "discord.js";
import { getHandler } from "./utils";

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const TOKEN = env.DISCORD_BOT_TOKEN;

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
    try {
        if (interaction.isChatInputCommand()) {
            await handleChatInputCommand(interaction);
        }
    } catch (error) {
        console.error(error);
    }
});

client.login(TOKEN);

async function handleChatInputCommand(
    interaction: ChatInputCommandInteraction
) {
    try {
        const handler = await getHandler(interaction.commandName);
        await handler(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply(
            `Interaction not found. Ask babishh to fix this. interaction id: ${interaction.id}`
        );
    }
}
