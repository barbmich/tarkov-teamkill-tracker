import z from "zod";

export const EnvSchema = z.object({
    // Local
    NODE_ENV: z.enum(["development", "production"]).default("development"),

    // Database
    DATABASE_URL: z.string().min(1),

    // // Discord
    DISCORD_BOT_TOKEN: z.string().min(1),
    DISCORD_BOT_CLIENT_ID: z.string().min(1),
    DISCORD_BOT_GUILD_ID: z.string().min(1),
    DISCORD_GUILD_TARKOV_ROLE_ID: z.string().min(1),

    // // Tarkov
    GAME_CURRENT_PATCH: z.string().min(1),
});

export const env = EnvSchema.parse(process.env);

console.log(env);
