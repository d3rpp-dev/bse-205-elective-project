// import z from "zod";
import { trpcInstance } from "./init";
import { authMiddleware } from "../middleware";

import { DB } from "$lib/server/db";
import {
	encryptedBlobTable,
	publicKeyTable,
	symmetricKeyTable,
} from "$lib/drizzle";
import { eq, and, sql, inArray } from "drizzle-orm";
import { z } from "zod";

export const userRouter = trpcInstance.router({
	getUploadedFiles: trpcInstance.procedure
		.use(authMiddleware)
		.query(async (opts) => {
			DB.select({
				kid: encryptedBlobTable.name,
			})
				.from(encryptedBlobTable)
				.where(eq(encryptedBlobTable.owner, opts.ctx.user.id));
		}),

	fetchUploadedFileMetadata: trpcInstance.procedure
		.use(authMiddleware)
		.input(
			z.object({
				kids: z.array(z.string().ulid()),
			}),
		)
		.query(async (opts) => {
			return (
				await DB.select({
					name: encryptedBlobTable.name,
					size: sql<number>`length(${encryptedBlobTable.blob})`,
					id: encryptedBlobTable.kid,
					owner: encryptedBlobTable.owner,
					iv: encryptedBlobTable.iv,
				})
					.from(encryptedBlobTable)
					.leftJoin(
						symmetricKeyTable,
						eq(symmetricKeyTable.kid, encryptedBlobTable.kid),
					)
					.leftJoin(
						publicKeyTable,
						eq(symmetricKeyTable.publicKey, publicKeyTable.kid),
					)
					.where(
						and(
							and(
								eq(publicKeyTable.keyOwner, opts.ctx.user.id),
								inArray(publicKeyTable.kid, opts.input.kids),
							),
							eq(encryptedBlobTable.state, "up"),
						),
					)
			).map((value) => {
				return {
					...value,
					owner: value.owner === opts.ctx.user.id,
					iv: value.iv as string,
				};
			});
		}),
});
