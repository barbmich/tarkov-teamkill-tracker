import { EmbedBuilder, SlashCommandBuilder, } from "discord.js";
import { desc, sql } from "drizzle-orm";
import { client } from "src/app";
import { db } from "src/db";
import { entries } from "src/db/schema";
import { env } from "src/env";
import { Command } from "src/utils";
export default new Command({
    name: "tarkov_teamkill_leaderboard",
    description: "Shows the current leaderboard",
    command: new SlashCommandBuilder(),
    handler: async (interaction) => {
        await interaction.reply({
            embeds: [await getLeaderboardEmbed()],
        });
    },
});
async function getLeaderboardEmbed() {
    const data = await db
        .select({
        killer: entries.killerUserId,
        count: sql `cast(count(${entries.killerUserId}) as int)`,
    })
        .from(entries)
        .where(sql `${entries.suicide} = false`)
        .groupBy(entries.killerUserId)
        .orderBy(desc(entries.killerUserId));
    const list = data.map((entry) => ({
        ...entry,
        killer: client.users.cache.get(entry.killer)?.username,
    }));
    return new EmbedBuilder()
        .setTitle(`Tarkov teamkills leaderboard - patch ${env.GAME_CURRENT_PATCH}`)
        .addFields({
        name: "Player",
        value: list.map((x) => x.killer).join("\n"),
        inline: true,
    }, {
        name: "Teamkills",
        value: list.map((x) => x.count).join("\n"),
        inline: true,
    });
}
//# sourceMappingURL=tarkov_teamkill_leaderboard.js.map