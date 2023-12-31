import { SlashCommandBuilder, } from "discord.js";
import { client } from "src/app";
import { db } from "src/db";
import { entries } from "src/db/schema";
import { env } from "src/env";
import { Command } from "src/utils";
import z from "zod";
const TarkovTeamkillSchema = z.object({
    killer: z.custom(),
    victim: z.custom(),
});
export default new Command({
    name: "tarkov_teamkill",
    description: "Adds a kill to the killer's stats",
    command: new SlashCommandBuilder()
        .addUserOption((option) => option
        .setName("killer")
        .setDescription("The killer")
        .setRequired(true))
        .addUserOption((option) => option
        .setName("victim")
        .setDescription("The victim")
        .setRequired(true)),
    handler: async (interaction) => {
        const { killer, victim } = TarkovTeamkillSchema.parse({
            killer: interaction.options.getUser("killer"),
            victim: interaction.options.getUser("victim"),
        });
        const isCheckTrue = await checkTarkovRole(killer, victim, interaction);
        if (isCheckTrue) {
            return;
        }
        const isSuicide = getIsSuicide(killer, victim);
        const data = await db
            .insert(entries)
            .values({
            killerUserId: killer.id,
            killedUserId: victim.id,
            suicide: isSuicide,
        })
            .returning({
            timestampDate: entries.timestamp,
        });
        if (data.length !== 1) {
            throw new Error(`got a different response than 1 when adding teamkill: ${killer.username} killed ${victim.username} at ${Date.now()}, interaction id: ${interaction.id}`);
        }
        const timestampUnix = Math.floor(new Date(data[0].timestampDate).getTime() / 1000);
        const reply = getReply(killer, victim, timestampUnix);
        await interaction.reply(reply);
    },
});
function getIsSuicide(killer, victim) {
    return killer.id === victim.id;
}
function getReply(killer, victim, timestamp) {
    if (getIsSuicide(killer, victim)) {
        return `Added kill to database: **${killer.username}** killed themselves on <t:${timestamp}>`;
    }
    return `Added kill to database: **${killer.username}** killed **${victim.username}** at <t:${timestamp}>`;
}
async function checkTarkovRole(killer, victim, interaction) {
    const guild = client.guilds.cache.get(env.DISCORD_BOT_GUILD_ID);
    const role = guild?.roles.cache.get(env.DISCORD_GUILD_TARKOV_ROLE_ID);
    if (role?.members.has(killer.id) === false) {
        await interaction.reply(`The killer is not a member of the Tarkov role.`);
        return true;
    }
    if (role?.members.has(victim.id) === false) {
        await interaction.reply(`The victim is not a member of the Tarkov role.`);
        return true;
    }
    return false;
}
//# sourceMappingURL=tarkov_teamkill.js.map