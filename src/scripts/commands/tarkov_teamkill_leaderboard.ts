import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";
import { desc, sql } from "drizzle-orm";
import { client } from "../../app";
import { db } from "../../db";
import { entries } from "../../db/schema";
import { env } from "../../env";
import { Command } from "../../utils";

export default new Command({
    name: "tarkov_teamkill_leaderboard",
    description: "Shows the current leaderboard",
    command: new SlashCommandBuilder(),
    handler: async (interaction: ChatInputCommandInteraction) => {
        const content = await getLeaderboardEmbed();
        await interaction.reply(
            typeof content === "string" ? content : { embeds: [content] }
        );
    },
});

async function getLeaderboardEmbed() {
    const data = await db
        .select({
            killer: entries.killerUserId,
            count: sql<number>`cast(count(${entries.killerUserId}) as int)`,
        })
        .from(entries)
        .where(sql`${entries.suicide} = false`)
        .groupBy(entries.killerUserId)
        .orderBy(desc(entries.killerUserId));

    if (data.length === 0) {
        return "No entries yet!";
    }

    const list = data.map((entry) => ({
        ...entry,
        killer: client.users.cache.get(entry.killer)?.username,
    }));

    return new EmbedBuilder()
        .setTitle(
            `Tarkov teamkills leaderboard - patch ${env.GAME_CURRENT_PATCH}`
        )
        .addFields(
            {
                name: "Player",
                value: list.map((x) => x.killer).join("\n"),
                inline: true,
            },
            {
                name: "Teamkills",
                value: list.map((x) => x.count).join("\n"),
                inline: true,
            }
        );
}
