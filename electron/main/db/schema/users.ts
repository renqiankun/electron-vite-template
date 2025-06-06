import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export  const users = sqliteTable('users', {
  id: integer().primaryKey(),
  first_name: text(),
  email: text(),
})
