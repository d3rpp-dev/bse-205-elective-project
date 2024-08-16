import z from "zod";
import { trpcInstance } from "./init";

import { DB } from "$lib/server/db";
import { userTable, userAliasTable } from "$lib/drizzle";
import { eq, or } from "drizzle-orm";

export const authRouter = trpcInstance.router({
	check_username_availability: trpcInstance.procedure
		.input(
			z.object({
				username: z
					.string()
					.max(32)
					.describe("Username to check usage of"),
			}),
		)
		.query(async (opts) => {
			const username = opts.input.username;

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

			await new Promise((res) => setTimeout(res, 1000));

			return {
				available: query.length === 0,
			};
		}),
});
