import z from "zod";

import { trpcInstance } from "./init";
import { TRPCError } from "@trpc/server";

import { DB } from "$lib/server/db";
import { publicKeyTable, reservedKIDTable } from "$lib/drizzle";
import { eq, and } from "drizzle-orm";
import { authMiddleware } from "../middleware";
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
			await new Promise((res) => setTimeout(res, 500));

			return await DB.select({
				name: publicKeyTable.name,
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

				const reserved_key_check = (
					await tx
						.select({ kid: reservedKIDTable.kid })
						.from(reservedKIDTable)
						.where(eq(reservedKIDTable.user, opts.ctx.user.id))
				).map((val) => val.kid);

				if (!reserved_key_check.includes(kid)) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: `${kid} has not been reserved for this user.`,
					});
				}

				const rows = await tx
					.delete(reservedKIDTable)
					.where(eq(reservedKIDTable.kid, kid))
					.returning();

				if (rows.length != 1) {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: `Expected Reserved KID Deletion to be 1, got ${rows}`,
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
});
