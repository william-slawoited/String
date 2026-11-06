import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

export * from "./auth-schema";

export const scores = sqliteTable("scores", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  composer: text("composer"),
  instrument: text("instrument"),
  genre: text("genre"),
  difficulty: integer("difficulty"),
  fileUrl: text("file_url"),
  uploadedBy: text("uploaded_by").references(() => user.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const favorites = sqliteTable(
  "favorites",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    scoreId: integer("score_id")
      .notNull()
      .references(() => scores.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.scoreId] })]
);

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
