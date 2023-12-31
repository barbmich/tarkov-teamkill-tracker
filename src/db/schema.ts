import {
    boolean,
    pgTable,
    serial,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

export const entries = pgTable("entries", {
    id: serial("id").primaryKey(),
    killerUserId: varchar("killer_user_id").notNull(),
    killedUserId: varchar("victim_user_id").notNull(),
    timestamp: timestamp("timestamp").notNull().defaultNow(),
    suicide: boolean("suicide").default(false),
    patch: varchar("game_patch").default(process.env.GAME_CURRENT_PATCH!),
    enteredBy: varchar("entered_by").notNull(),
    interactionId: varchar("interaction_id").notNull(),
});
