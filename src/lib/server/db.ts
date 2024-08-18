import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";

import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

import { migrate } from "drizzle-orm/bun-sqlite/migrator";

const sqlite = new Database(Bun.env.DATABASE_FILE ?? "./database.db", {
	strict: true,
});

// enable WAL, which provides better performance, usually.
sqlite.exec("PRAGMA journal_mode = WAL;");
// enable foreign key restraints
sqlite.exec("PRAGMA foreign_keys = on;");

export const DB = drizzle(sqlite, {
	logger: process.env.NODE_ENV == "development",
});

/**
 * Generate an ephemeral test database, this is an in-memory data store
 * used for testing that everything works, the second the database
 * variable goes out of scope, the database will be deleted.
 *
 * @returns { BunSQLiteDatabase } The in-memory test Database
 */
export const ephemeral_test_db = (): BunSQLiteDatabase => {
	const db = new Database(":memory:", { strict: true });

	// enable foreign key restraints
	db.exec("PRAGMA foreign_keys = on;");

	const drizzle_db = drizzle(db);

	migrate(drizzle_db, { migrationsFolder: "./drizzle" });

	return drizzle_db;
};
