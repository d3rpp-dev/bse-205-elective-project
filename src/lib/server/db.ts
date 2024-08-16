import { dev } from "$app/environment";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

const sqlite = new Database(Bun.env.DATABASE_FILE ?? "./database.db");
export const DB = drizzle(sqlite, { logger: dev });
