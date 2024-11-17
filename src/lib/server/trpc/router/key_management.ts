import z from "zod";

import { trpcInstance } from "./init";
import { authMiddleware } from "../middleware";
import { TRPCError } from "@trpc/server";

import { DB } from "$lib/server/db";
import { publicKeyTable, reservedKIDTable } from "$lib/drizzle";
import { eq, and } from "drizzle-orm";

import { monotonic_ulid } from "$lib/utils";

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
		.use(authMiddleware)
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
		.use(authMiddleware)
		.query(async (opts) => {
			return await DB.select({
				name: publicKeyTable.name,
				kid: publicKeyTable.kid,
			})
				.from(publicKeyTable)
				.where(eq(publicKeyTable.keyOwner, opts.ctx.user.id));
		}),
	// #endregion
	// #region Update Key Name
	updateKeyName: trpcInstance.procedure
		.use(authMiddleware)
		.input(
			z.object({
				kid: z.string().ulid(),
				new_name: z.string().min(4).max(50),
			}),
		)
		.mutation(async (opts) => {
			return await DB.transaction(async (tx_db) => {
				const rows_updated = await tx_db
					.update(publicKeyTable)
					.set({
						name: opts.input.new_name,
					})
					.where(
						and(
							eq(publicKeyTable.kid, opts.input.kid),
							eq(publicKeyTable.keyOwner, opts.ctx.user.id),
						),
					)
					.returning();

				if (rows_updated.length == 0) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: `No Such Public Key`,
					});
				} else if (rows_updated.length > 1) {
					throw new TRPCError({
						code: "CONFLICT",
						message: `Operation would update more than one public key name`,
					});
				} else {
					return true;
				}
			});
		}),
	// #endregion
	// #region Upload Public Key
	/**
	 * Upload a public key to be used for allowing sharing
	 */
	uploadPublicKey: trpcInstance.procedure
		.use(authMiddleware)
		.input(
			z.object({
				kid: z.string().ulid(),
				name: z.string(),
				key_b64: z.string().base64(),
			}),
		)
		.mutation(async (opts) => {
			const { kid, key_b64, name } = opts.input;

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
							key: key_b64,
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
		.use(authMiddleware)
		.input(
			z.object({
				kid: z.string().ulid(),
			}),
		)
		.mutation(async (opts) => {
			const user_id = opts.ctx.user.id;
			console.log("Delete pubic key", opts.input.kid);

			return await DB.transaction(async (tx_db) => {
				// this doesnt work
				// AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
				//
				// forign key constraints moment
				const deletion_result = await tx_db
					.delete(publicKeyTable)
					.where(
						and(
							eq(publicKeyTable.kid, opts.input.kid),
							eq(publicKeyTable.keyOwner, user_id),
						),
					)
					.returning({ kid: publicKeyTable.kid });

				if (deletion_result.length == 0) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: `Key with KID ${opts.input.kid} does not exist`,
					});
				} else {
					return deletion_result[0].kid;
				}
			});
		}),
	// #endregion
	// #region Reserve KID
	/**
	 * To be safe I'm adding a hard limit to how many key IDs a user can reserve,
	 *
	 * # this hard limit is **5**
	 *
	 * This function will always succeed, but it may sometimes return
	 * an already reserved kid.
	 */
	reserveKID: trpcInstance.procedure
		.use(authMiddleware)
		.mutation(async (opts) => {
			const user_id = opts.ctx.user.id;

			return await DB.transaction(async (tx_db) => {
				const reserved_keys_query = await tx_db
					.select({ kid: reservedKIDTable.kid })
					.from(reservedKIDTable)
					.where(eq(reservedKIDTable.user, user_id));

				const reserved_key_count = reserved_keys_query.length;
				const MAXIMUM_RESERVED_KIDS = 5;

				// if they have the maximum just return one of the previous ones.
				if (reserved_key_count >= MAXIMUM_RESERVED_KIDS) {
					const random_idx = Math.floor(
						Math.random() * (reserved_key_count - 1),
					);
					const item = reserved_keys_query[random_idx];
					return {
						reused: true,
						...item,
					};
				} else {
					const kid = monotonic_ulid();

					await tx_db.insert(reservedKIDTable).values({
						kid,
						user: user_id,
					});

					return {
						reused: false,
						kid,
					};
				}
			});
		}),
	// #endregion
	// #region Rename Key
	renameKey: trpcInstance.procedure
		.use(authMiddleware)
		.input(
			z.object({
				kid: z.string().ulid(),
				new_name: z.string().max(40),
			}),
		)
		.mutation(async (opts) => {
			return await DB.transaction(async (tx_db) => {
				const query_result = await tx_db
					.update(publicKeyTable)
					.set({
						name: opts.input.new_name,
					})
					.where(
						and(
							eq(publicKeyTable.kid, opts.input.kid),
							eq(publicKeyTable.keyOwner, opts.ctx.user.id),
						),
					)
					.returning({
						new_name: publicKeyTable.name,
					});

				if (query_result.length == 0) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: `Key with KID ${opts.input.kid} not found`,
					});
				} else if (query_result.length > 1) {
					throw new TRPCError({
						code: "CONFLICT",
						message:
							"multiple public keys would be renamed by this action, this cannot be done.",
					});
				} else {
					return query_result[0].new_name;
				}
			});
		}),
	// #endregion
});
