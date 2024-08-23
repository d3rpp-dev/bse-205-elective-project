import type { LayoutServerLoad } from "./$types";

export const load = (async (event) => {
	const { user } = await event.parent();

	return { user };
}) satisfies LayoutServerLoad;
