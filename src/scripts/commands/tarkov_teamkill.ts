import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "src/utils";

export default new Command({
    name: "tarkov_teamkill",
    description: "Adds a kill to the killer's stats",
    command: new SlashCommandBuilder()
        .addUserOption((option) =>
            option
                .setName("killer")
                .setDescription("The killer")
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("victim")
                .setDescription("The victim")
                .setRequired(true)
        ),
    handler: async (interaction: ChatInputCommandInteraction) => {
        interaction.reply("tarkov_teamkill");
    },
});
