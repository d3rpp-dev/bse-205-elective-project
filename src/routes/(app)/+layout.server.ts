import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

/**
 * App shall require auth.
 */
export const load = (async (event) => {
	if (event.locals.session === null) redirect(302, "/auth/login");
}) satisfies LayoutServerLoad;