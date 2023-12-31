import dotenv from "dotenv";
import path from "path";
dotenv.config({
    path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV ?? "development"}`),
});
export default {
    schema: "./src/db/schema.ts",
    out: "./migrations",
    driver: "pg",
    verbose: true,
    strict: true,
    dbCredentials: {
        host: process.env.PG_HOST,
        port: Number(process.env.PG_PORT),
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
    },
};
//# sourceMappingURL=drizzle.config.js.map