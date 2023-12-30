import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const entries = pgTable("entries", {
    id: serial("id").primaryKey(),
    killerUserId: varchar("killer_user_id").notNull(),
    killedUserId: varchar("killed_user_id").notNull(),
    timestamp: timestamp("timestamp").notNull().defaultNow(),
});
