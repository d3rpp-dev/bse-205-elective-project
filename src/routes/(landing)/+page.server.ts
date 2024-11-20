import type { PageServerLoad, PageServerLoadEvent } from "./$types";

export const load = (({ locals }: PageServerLoadEvent) => {
	return {
		is_signed_in: locals.user !== null,
	};
}) satisfies PageServerLoad;
