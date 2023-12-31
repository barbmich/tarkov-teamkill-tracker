import {
    ChatInputCommandInteraction,
    Guild,
    SlashCommandBuilder,
    User,
} from "discord.js";
import { client } from "../../app";
import { db } from "../../db";
import { entries } from "../../db/schema";
import { env } from "../../env";
import { Command } from "../../utils";
import z from "zod";

const TarkovTeamkillSchema = z.object({
    killer: z.custom<User>(),
    victim: z.custom<User>(),
});

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
                enteredBy: interaction.user.id,
                interactionId: interaction.id,
            })
            .returning({
                timestampDate: entries.timestamp,
            });

        if (data.length !== 1) {
            throw new Error(
                `got a different response than 1 when adding teamkill: ${
                    killer.username
                } killed ${victim.username} at ${Date.now()}, interaction id: ${
                    interaction.id
                }`
            );
        }

        const timestampUnix = Math.floor(
            new Date(data[0].timestampDate).getTime() / 1000
        );

        const reply = getReply(killer, victim, timestampUnix);

        await interaction.reply(reply);
    },
});

function getIsSuicide(killer: User, victim: User) {
    return killer.id === victim.id;
}

function getReply(killer: User, victim: User, timestamp: number) {
    if (getIsSuicide(killer, victim)) {
        return `Added kill to database: **${killer.username}** killed themselves on <t:${timestamp}>`;
    }

    return `Added kill to database: **${killer.username}** killed **${victim.username}** at <t:${timestamp}>`;
}

async function checkTarkovRole(
    killer: User,
    victim: User,
    interaction: ChatInputCommandInteraction
) {
    const guild = getGuildCache();
    if (!guild) {
        throw new Error("guild not found");
    }

    const tarkovRole = getRoleCache(guild);
    if (!tarkovRole) {
        throw new Error("role not found");
    }

    const adminRole = guild.roles.cache.find(
        (guild) => guild.name === "capo supremo"
    );

    if (tarkovRole.members.has(interaction.user.id) === false) {
        let reply =
            "You are not a member of the Tarkovians. If you think this is a mistake, contact any of the **capi supremi**";
        if (adminRole) {
            reply += `: ${adminRole.members
                .map((member) => member.user.username)
                .join(", ")}`;
        }
        await interaction.reply(reply);
        return true;
    }

    if (tarkovRole.members.has(killer.id) === false) {
        await interaction.reply(
            `The killer is not a member of the Tarkovians.`
        );
        return true;
    }

    if (tarkovRole.members.has(victim.id) === false) {
        await interaction.reply(
            `The victim is not a member of the Tarkovians.`
        );
        return true;
    }

    return false;
}

function getGuildCache() {
    return client.guilds.cache.get(env.DISCORD_BOT_GUILD_ID);
}

function getRoleCache(guild: Guild) {
    return guild.roles.cache.get(env.DISCORD_GUILD_TARKOV_ROLE_ID);
}
