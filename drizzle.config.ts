import "./src/dotenv";
import { env } from "./src/env";
import type { Config } from "drizzle-kit";

export default {
    schema: "./src/db/schema.ts",
    out: "./migrations",
    driver: "pg",
    verbose: true,
    strict: true,
    dbCredentials: {
        connectionString: env.DATABASE_URL,
    },
} satisfies Config;
