import z from "zod";
import { trpcInstance } from "./init";

import { DB } from "$lib/server/db";
import { userTable, userAliasTable } from "$lib/drizzle";
import { eq, or } from "drizzle-orm";

export const authRouter = trpcInstance.router({
	check_username_availability: trpcInstance.procedure
		.input(
			z
				.string()
				.max(32, "invalid_length")
				.regex(/^[a-z0-9_]+$/, "invalid_chars"),
		)
		.query(async (opts) => {
			const username = opts.input;

			if (username == "test_user") return { available: false };

			console.log("checking", JSON.stringify(username));

			const query = await DB.select({
				user_id: userTable.id,
				user_alias_id: userAliasTable.id,
			})
				.from(userTable)
				.innerJoin(userAliasTable, eq(userTable.id, userAliasTable.id))
				.where(
					or(
						eq(userTable.username, username),
						eq(userAliasTable.alias_name, username),
					),
				);

			return {
				available: query.length === 0,
			};
		}),
});
