import { trpc } from "$lib/trpc/client";
import type { PageLoad } from "./$types";

export const load = (async (event) => {
	const { queryClient } = await event.parent();
	const client = trpc(event, queryClient);

	return {
		uploadedFileCount:
			await client.user.getUploadedFiles.createServerQuery(undefined, {
                ssr: false
            }),
	};
}) satisfies PageLoad;
