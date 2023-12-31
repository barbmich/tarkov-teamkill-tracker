import { Client, GatewayIntentBits, } from "discord.js";
import { getHandler } from "./utils";
import { env } from "./env";
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
    }
    catch (error) {
        console.error(error);
    }
});
client.login(TOKEN);
async function handleChatInputCommand(interaction) {
    try {
        const handler = await getHandler(interaction.commandName);
        await handler(interaction);
    }
    catch (error) {
        console.error(error);
        await interaction.reply(`Interaction not found. Ask babishh to fix this. interaction id: ${interaction.id}`);
    }
}
//# sourceMappingURL=app.js.map