import { migrate } from "drizzle-orm/bun-sqlite/migrator";

import { DB } from "../lib/server/db";

migrate(DB, { migrationsFolder: "./drizzle" });
