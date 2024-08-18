import z from "zod";
import { trpcInstance } from "./init";

import { DB } from "$lib/server/db";
import { userTable, userAliasTable, passwordTable } from "$lib/drizzle";
import { eq, or } from "drizzle-orm";

const USERNAME_SCHEMA = z
	.string()
	.max(32, "invalid_length")
	.regex(/^[a-z0-9_]+$/, "invalid_chars");

export const authRouter = trpcInstance.router({
	// #region Check Username
	check_username_availability: trpcInstance.procedure
		.input(USERNAME_SCHEMA)
		.query(async (opts) => {
			const username = opts.input;

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
	// #endregion
	// #region Sign Up
	sign_up: trpcInstance.procedure
		.input(
			z.object({
				username: USERNAME_SCHEMA,
				password: z.string().min(8),
			}),
		)
		.mutation(async (opts) => {
			const { username, password } = opts.input;

			const password_hash = await Bun.password.hash(password, "argon2id");

			const user_id = await DB.transaction(async (tx) => {
				const user = await tx
					.insert(userTable)
					.values({
						username,
					})
					.returning({ user_id: userTable.id });

				await tx.insert(passwordTable).values({
					user_id: user[0].user_id,
					password_hash,
				});

				return user[0].user_id;
			});

			console.log("Created User", user_id);

			// todo: return user token
		}),
	// #endregion
});
