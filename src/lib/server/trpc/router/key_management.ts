import z from "zod";

import { trpcInstance } from "./init";
import { TRPCError } from "@trpc/server";

import { DB } from "$lib/server/db";
import { publicKeyTable } from "$lib/drizzle";
import { eq } from "drizzle-orm";

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
				key_b64: z.string().base64(),
			}),
		)
		.mutation(async (opts) => {
			const { kid, key_b64 } = opts.input;
			const decoded_key = Buffer.from(key_b64, "base64");

			DB.transaction(async (tx) => {
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

				await tx.insert(publicKeyTable).values({
					kid: kid,
					keyOwner: opts.ctx.user.id,
					key: decoded_key,
				});
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
			console.log(" Delete pubic key".trim(), opts.input.kid);

			throw new TRPCError({
				code: "NOT_IMPLEMENTED",
			});
		}),
	// #endregion
});
