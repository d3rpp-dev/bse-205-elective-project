import type { RequestHandler, RequestEvent } from "./$types";
import { DB } from "$lib/server/db";
import { encryptedBlobTable } from "$lib/drizzle";
import z from "zod";
import { and, eq } from "drizzle-orm";

const ULID_SCHEMA = z.string().ulid();

/**
 * Upload an encrypted blob
 */
export const POST = (async ({ params, locals, request }: RequestEvent) => {
	const { blob_id } = params;

	console.log(`Uploaded blob with ID ${blob_id}`);

	if (!ULID_SCHEMA.safeParse(blob_id).success) {
		return new Response(null, {
			status: 400,
		});
	}

	if (!(locals.session && locals.user)) {
		return new Response(null, {
			status: 401,
		});
	}

	const candidates = await DB.select({
		kid: encryptedBlobTable.kid,
	})
		.from(encryptedBlobTable)
		.where(
			and(
				eq(encryptedBlobTable.kid, blob_id),
				eq(encryptedBlobTable.state, "fresh"),
			),
		);

	if (candidates.length > 1) {
		return new Response(null, {
			status: 409,
		});
	} else if (candidates.length == 0) {
		return new Response(null, {
			status: 404,
		});
	} else {
		console.log("got past checks, uploading blob into db");
		const formData = await request.formData();
		const file = formData.get("file") as File | null;

		if (file === null) return new Response(null, { status: 400 });

		const file_content = await file.bytes();

		await DB.transaction(async (tx_db) => {
			await tx_db
				.update(encryptedBlobTable)
				.set({
					state: "up",
					blob: file_content,
				})
				.where(
					and(
						eq(encryptedBlobTable.kid, blob_id),
						eq(encryptedBlobTable.state, "fresh"),
					),
				);
		});

		console.log("in db now");

		return new Response(null, {
			status: 204,
		});
	}
}) satisfies RequestHandler;
