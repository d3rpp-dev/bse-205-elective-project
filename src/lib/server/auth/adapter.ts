import { Lucia } from "lucia";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";

import { DB } from "$lib/server/db";
import { userTable, sessionTable, type UserSelectModel } from "$lib/drizzle";

import { dev } from "$app/environment";

const luciaAdapter = new DrizzleSQLiteAdapter(DB, sessionTable, userTable);

export const lucia = new Lucia(luciaAdapter, {
	sessionCookie: {
		attributes: {
			secure: !dev,
		},
	},
	getUserAttributes: (db_user) => {
		return { ...db_user };
	},
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: Omit<UserSelectModel, "id">;
	}
}
