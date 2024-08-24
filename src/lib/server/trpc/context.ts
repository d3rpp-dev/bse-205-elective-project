import type { RequestEvent } from "@sveltejs/kit";

export const createContext = async (event: RequestEvent) => {
	const { user, session } = event.locals;

	return {
		event,
		user,
		session,
	};
};

export type Context = Awaited<ReturnType<typeof createContext>>;
