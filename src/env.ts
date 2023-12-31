import z from "zod";
import dotenv from "dotenv";
import path from "path";

export const EnvSchema = z.object({
    // Local
    CWD: z.string().min(1).default(process.cwd()),
    NODE_ENV: z.enum(["development", "production"]).default("development"),

    // Database
    PG_HOST: z.string().min(1),
    PG_PORT: z.string().min(1),
    PG_USER: z.string().min(1),
    PG_PASSWORD: z.string().min(1),
    PG_DATABASE: z.string().min(1),

    // Discord
    DISCORD_BOT_TOKEN: z.string().min(1),
    DISCORD_BOT_CLIENT_ID: z.string().min(1),
    DISCORD_BOT_GUILD_ID: z.string().min(1),
    DISCORD_GUILD_TARKOV_ROLE_ID: z.string().min(1),
});

const loadConfig = async () => {
    dotenv.config({
        path: path.resolve(
            process.cwd(),
            `.env.${process.env.NODE_ENV ?? "development"}`
        ),
    });
    return Promise.resolve();
};

const getEnv = async () => {
    await loadConfig();
    return EnvSchema.parse(process.env);
};

export const env = await getEnv();
