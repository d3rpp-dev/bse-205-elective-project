import z from "zod";

import { trpcInstance } from "./init";
import { TRPCError } from "@trpc/server";

import { DB } from "$lib/server/db";
import { publicKeyTable } from "$lib/drizzle";
import { eq, and } from "drizzle-orm";

export const keyManagementRouter = trpcInstance.router({
	// #region Download Public Key
	/**
	 * Download a public key
	 *
	 * Any user can download a public key of any other user
	 * (hense the name *public* key), so we will not bother
	 * checking who is downloading.
	 *
	 * HOWEVER, we do want to ensure only authenticated users
	 * are doing the downloading, hense the {@link auth_middleware}
	 * usage.
	 */
	downloadPublicKey: trpcInstance.procedure
		.use((opts) => {
			const user = opts.ctx.user;

			if (!user) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
				});
			} else {
				return opts.next({
					ctx: {
						user,
					},
				});
			}
		})
		.input(
			z.object({
				kid: z.string().ulid(),
			}),
		)
		.query(async (opts) => {
			const kid = opts.input.kid;
			console.log(`attempting to get public key - ${kid}`);

			const public_key_selection = await DB.select({
				key: publicKeyTable.key,
			})
				.from(publicKeyTable)
				.where(eq(publicKeyTable.kid, kid))
				.limit(1);

			if (public_key_selection.length === 0) {
				throw new TRPCError({
					code: "NOT_FOUND",
				});
			} else {
				return {
					key_b64: Buffer.from(
						public_key_selection[0].key as Uint8Array,
					).toString("base64"),
				};
			}
		}),
	// #endregion
	// #region Get Keys for User
	getUserPublicKeys: trpcInstance.procedure
		.use((opts) => {
			const user = opts.ctx.user;

			if (!user) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
				});
			} else {
				return opts.next({
					ctx: {
						user,
					},
				});
			}
		})
		.query(async (opts) => {
			await new Promise((res) => setTimeout(res, 500));

			return await DB.select({
				kid: publicKeyTable.kid,
			})
				.from(publicKeyTable)
				.where(eq(publicKeyTable.keyOwner, opts.ctx.user.id));
		}),
	// #endregion
	// #region Upload Public Key
	/**
	 * Upload a public key to be used for allowing sharing
	 */
	uploadPublicKey: trpcInstance.procedure
		.use((opts) => {
			const user = opts.ctx.user;

			if (!user) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
				});
			} else {
				return opts.next({
					ctx: {
						user,
					},
				});
			}
		})
		.input(
			z.object({
				kid: z.string().ulid(),
                name: z.string(),
				key_b64: z.string().base64(),
			}),
		)
		.mutation(async (opts) => {
			const { kid, key_b64, name } = opts.input;
			const decoded_key = Buffer.from(key_b64, "base64");

			return await DB.transaction(async (tx) => {
				const duplication_check = await tx
					.select({ kid: publicKeyTable.kid })
					.from(publicKeyTable)
					.where(eq(publicKeyTable.kid, kid));

				if (duplication_check.length > 0) {
					throw new TRPCError({
						code: "CONFLICT",
						message: `Public Key with id of ${kid} already exists`,
					});
				}

				return (
					await tx
						.insert(publicKeyTable)
						.values({
							kid: kid,
                            name,
							keyOwner: opts.ctx.user.id,
							key: decoded_key,
						})
						.returning({ kid: publicKeyTable.kid })
				)[0].kid;
			});
		}),
	// #endregion
	// #region Delete Public Key
	/**
	 * Delete a public key, not likely to be used but here in case.
	 */
	deletePublicKey: trpcInstance.procedure
		.use((opts) => {
			const user = opts.ctx.user;

			if (!user) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
				});
			} else {
				return opts.next({
					ctx: {
						user,
					},
				});
			}
		})
		.input(
			z.object({
				kid: z.string().ulid(),
			}),
		)
		.mutation(async (opts) => {
			const user_id = opts.ctx.user.id;
			console.log("Delete pubic key", opts.input.kid);

			return await DB.transaction(async (tx_db) => {
				const suitable_keys = await tx_db
					.select({
						kid: publicKeyTable.kid,
						owner: publicKeyTable.keyOwner,
					})
					.from(publicKeyTable)
					.where(
						and(
							eq(publicKeyTable.kid, opts.input.kid),
							eq(publicKeyTable.keyOwner, user_id),
						),
					);

				if (suitable_keys.length == 0) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: `Key with KID ${opts.input.kid} does not exist`,
					});
				} else {
					return (
						await tx_db
							.delete(publicKeyTable)
							.where(eq(publicKeyTable.kid, opts.input.kid))
							.returning({ kid: publicKeyTable.kid })
					)[0].kid;
				}
			});
		}),
	// #endregion
});
