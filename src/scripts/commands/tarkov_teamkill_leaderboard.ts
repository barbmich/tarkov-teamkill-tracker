import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "src/utils";

export default new Command({
    name: "tarkov_teamkill_leaderboard",
    description: "Shows the current leaderboard",
    command: new SlashCommandBuilder(),
    handler: async (interaction: ChatInputCommandInteraction) => {
        interaction.reply("tarkov_teamkill_leaderboard");
    },
});
