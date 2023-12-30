import { drizzle } from "drizzle-orm/node-postgres";
import { entries } from "./schema";
import pg from "pg";

const pool = new pg.Pool({
    host: process.env.PG_HOST!,
    port: Number(process.env.PG_PORT!),
    user: process.env.PG_USER!,
    password: process.env.PG_PASSWORD!,
    database: process.env.PG_DATABASE!,
});

await pool.connect();
export const db = drizzle(pool, { schema: { entries } });
