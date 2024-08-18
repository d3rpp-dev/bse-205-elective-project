import type { RequestHandler } from "./$types";

import { DB } from "$lib/server/db";
import { publicAssetTable } from "$lib/drizzle";

import { eq } from "drizzle-orm";
import z from "zod";

const ULID_SCHEMA = z.string().ulid();

export const GET = (async (event) => {
	const file_id = event.params.file_id;
	const file_id_safe_parsed = ULID_SCHEMA.safeParse(file_id);
	// Check the file is in fact a ULID
	if (!file_id_safe_parsed.success)
		return new Response(file_id_safe_parsed.error.message, { status: 400 });

	const db_query = await DB.select({
		type: publicAssetTable.type,
		blob: publicAssetTable.blob,
	})
		.from(publicAssetTable)
		.where(eq(publicAssetTable.id, event.params.file_id));

	if (db_query.length == 0) return new Response(null, { status: 404 });

	const { type, blob } = db_query[0];

	return new Response(blob, {
		headers: {
			"Content-Type": type,
		},
	});
}) satisfies RequestHandler;
