import type { PageServerLoad, PageServerLoadEvent } from "./$types";

import { generateState } from "arctic";
import { github, type ValidOauthMethods } from "$lib/server/auth/oauth_methods";

import { error, redirect } from "@sveltejs/kit";
import { assert, type Equals } from "tsafe";

/**
 * a key for each oauth2 method, returns the URL to redirect the user to
 */
const OAUTH_METHODS = {
	github: async (event: PageServerLoadEvent) => {
		const state = generateState();
		const url = github.createAuthorizationURL(state, [
			"read:user",
			"user:email",
		]);

		event.cookies.set("github_oauth_state", state, {
			path: "/",
			secure: import.meta.env.PROD,
			httpOnly: true,
			maxAge: 60 * 10, // 10 minutes
			sameSite: "lax",
		});

		return url;
	},
};

assert<Equals<ValidOauthMethods, keyof typeof OAUTH_METHODS>>();

export const load = (async (event) => {
	if (Object.keys(OAUTH_METHODS).includes(event.params.method)) {
		redirect(
			302,
			await OAUTH_METHODS[
				event.params.method as keyof typeof OAUTH_METHODS
			](event),
		);
	} else {
		error(400, {
			message: "Invalid OAuth2.0 Method",
		});
	}
}) satisfies PageServerLoad;
