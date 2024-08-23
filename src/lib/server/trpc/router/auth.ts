import { trpcInstance } from "$lib/server/trpc/router/init";
import { DB } from "$lib/server/db";
import { lucia } from "$lib/server/auth/adapter";
import { USERNAME_SCHEMA, PASSWORD_SCHEMA } from "$lib/trpc/schemas";
import { userTable, userAliasTable, passwordTable } from "$lib/drizzle";

import z from "zod";
import { count, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// #region Check Username Availability Implementation
const checkAvailability = async (username: string) => {
	const [user_query, alias_query] = await Promise.all([
		DB.select({ users: count(userTable.username) })
			.from(userTable)
			.where(eq(userTable.username, username)),
		DB.select({ aliases: count(userAliasTable.alias_name) })
			.from(userAliasTable)
			.where(eq(userAliasTable.alias_name, username)),
	]);

	return user_query[0].users + alias_query[0].aliases == 0;
};
// #endregion

export const authRouter = trpcInstance.router({
	// #region Check Username
	check_username_availability: trpcInstance.procedure
		.input(USERNAME_SCHEMA)
		.query(async (opts) => {
			return {
				available: await checkAvailability(opts.input),
			};
		}),
	// #endregion
	// #region Sign Up
	sign_up: trpcInstance.procedure
		.input(
			z.object({
				username: USERNAME_SCHEMA,
				password: PASSWORD_SCHEMA,
			}),
		)
		.mutation(async (opts) => {
			const { username, password } = opts.input;

			const password_hash = await Bun.password.hash(password, "argon2id");

			if (!(await checkAvailability(username)))
				throw new TRPCError({
					code: "CONFLICT",
					message: "Username is already taken",
				});

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

			const session = await lucia.createSession(user_id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			opts.ctx.event.cookies.set(
				sessionCookie.name,
				sessionCookie.value,
				{
					path: ".",
					...sessionCookie.attributes,
				},
			);

			return;
		}),
	// #endregion
	// #region Log In
	log_in: trpcInstance.procedure
		.input(
			z.object({
				username: USERNAME_SCHEMA,
				password: PASSWORD_SCHEMA,
			}),
		)
		.mutation(async (opts) => {
			const { username, password } = opts.input;

			const existing_user_list = await DB.select({ id: userTable.id })
				.from(userTable)
				.where(eq(userTable.username, username))
				.limit(1);

			if (existing_user_list.length === 0) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Username or Password is invalid.",
				});
			}

			const [existing_user] = existing_user_list;

			const password_list = await DB.select({
				password_hash: passwordTable.password_hash,
			})
				.from(passwordTable)
				.where(eq(passwordTable.user_id, existing_user.id));

			if (password_list.length === 0) {
				// user does exist but does not have a password
				// this would mean the user used an oauth method.
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message:
						"Username does exist but does not have a password, you may have signed up with an OAuth2 Method.",
				});
			}

			const [existing_password] = password_list;

			const compared_password = await Bun.password.verify(
				password,
				existing_password.password_hash,
				"argon2id",
			);

			if (!compared_password) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "Username or Password is invalid.",
				});
			} else {
				const session = await lucia.createSession(existing_user.id, {});
				const sessionCookie = lucia.createSessionCookie(session.id);
				opts.ctx.event.cookies.set(
					sessionCookie.name,
					sessionCookie.value,
					{
						path: ".",
						...sessionCookie.attributes,
					},
				);

				return;
			}
		}),
	// #endregion
});
