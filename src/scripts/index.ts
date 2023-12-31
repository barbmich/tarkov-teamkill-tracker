import "../dotenv";
import { env } from "../env";
import { REST, Routes } from "discord.js";
import { getCommands } from "../utils";

const startScript = async () => {
    const TOKEN = env.DISCORD_BOT_TOKEN;
    const CLIENT_ID = env.DISCORD_BOT_CLIENT_ID;
    const GUILD_ID = env.DISCORD_BOT_GUILD_ID;

    const rest = new REST({ version: "10" }).setToken(TOKEN);

    try {
        console.log("Started refreshing application (/) commands.");

        const commands = await getCommands();
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            body: commands,
        });

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
};

(async () => {
    await startScript();
})();
