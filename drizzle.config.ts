import { loadConfig } from "./src/utils";
loadConfig;

import type { Config } from "drizzle-kit";

export default {
    schema: "./src/db/schema.ts",
    out: "./migrations",
    driver: "pg",
    verbose: true,
    strict: true,
    dbCredentials: {
        host: process.env.PG_HOST!,
        port: Number(process.env.PG_PORT!),
        user: process.env.PG_USER!,
        password: process.env.PG_PASSWORD!,
        database: process.env.PG_DATABASE!,
    },
} satisfies Config;
