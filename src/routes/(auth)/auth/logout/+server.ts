import { lucia } from "$lib/server/auth/adapter";
import type { RequestHandler } from "./$types";

export const GET = (async (event) => {
	const session = event.locals.session;
	if (session) await lucia.invalidateSession(session.id);
	event.cookies.set(lucia.sessionCookieName, "", {
		path: ".",
		expires: new Date(0),
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: "/",
		},
	});
}) satisfies RequestHandler;
