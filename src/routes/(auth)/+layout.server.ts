import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async (event) => {
	if (event.locals.session !== null) redirect(302, "/app");
}) satisfies LayoutServerLoad;
