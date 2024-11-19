import { DB } from "$lib/server/db";
import { authMiddleware } from "../middleware";
import { trpcInstance } from "./init";

import {
	publicKeyTable,
	encryptedBlobTable,
	symmetricKeyTable,
} from "$lib/drizzle";
import { and, eq } from "drizzle-orm";

import z from "zod";
import { TRPCError } from "@trpc/server";
import { monotonic_ulid } from "$lib/utils";

export const blobManagementRouter = trpcInstance.router({
	// #region Symmetric Key Upload
	uploadSymmetricKeyAndCreateEmptyBlob: trpcInstance.procedure
		.use(authMiddleware)
		.input(
			z.object({
				key_b64: z.string().base64(),
				pubkey: z.string().ulid(),
				file_name: z.string().min(3).max(100),
				iv_b64: z.string().base64(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return await DB.transaction(async (tx_db) => {
				const keyCount = (
					await tx_db
						.selectDistinct({ kid: publicKeyTable.kid })
						.from(publicKeyTable)
						.where(
							and(
								eq(publicKeyTable.kid, input.pubkey),
								eq(publicKeyTable.keyOwner, ctx.user.id),
							),
						)
				).length;

				if (keyCount == 0) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "No public key uploaded",
					});
				} else if (keyCount > 1) {
					throw new TRPCError({
						code: "CONFLICT",
						message:
							"Multiple keys uploaded with KID, don't know what to do.",
					});
				} else {
					const [{ kid }] = await tx_db
						.insert(symmetricKeyTable)
						.values({
							key: input.key_b64,
							publicKey: input.pubkey,
							kid: monotonic_ulid(),
						})
						.returning();

					await tx_db.insert(encryptedBlobTable).values({
						kid: kid,
						name: input.file_name,
						state: "fresh",
						owner: ctx.user.id,
						iv: input.iv_b64,
					});

					return kid;
				}
			});
		}),
	// #endregion
	// #region Symmetric Key Download
	downloadSymmeticKey: trpcInstance.procedure
		.use(authMiddleware)
		.input(
			z.object({
				kid: z.string().ulid(),
			}),
		)
		.query(async (opts) => {
			const keys = await DB.select({
				key_b64: symmetricKeyTable.key,
				pubkey: symmetricKeyTable.publicKey,
			})
				.from(symmetricKeyTable)
				.leftJoin(
					publicKeyTable,
					eq(symmetricKeyTable.publicKey, publicKeyTable.kid),
				)
				.where(
					and(
						eq(publicKeyTable.keyOwner, opts.ctx.user.id),
						eq(symmetricKeyTable.kid, opts.input.kid),
					),
				);

			if (keys.length != 1) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "No key found",
				});
			} else {
				return {
					...keys[0],
					key_b64: keys[0].key_b64 as string,
				};
			}
		}),
	// #endregion
});
