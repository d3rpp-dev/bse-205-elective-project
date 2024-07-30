import { migrate } from "drizzle-orm/bun-sqlite/migrator";

import { DB } from "./lib/server/db";

await migrate(DB, { migrationsFolder: "./drizzle" });
