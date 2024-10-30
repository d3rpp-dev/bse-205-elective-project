import type { RequestHandler, RequestEvent } from "./$types";

import { generateState } from "arctic";
import { github, type ValidOauthMethods } from "$lib/server/auth/oauth_methods";

import { redirect } from "@sveltejs/kit";
import { assert, type Equals } from "tsafe";

/**
 * a key for each oauth2 method, returns the URL to redirect the user to
 */
const OAUTH_METHODS = {
	github: async (event: RequestEvent) => {
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

export const GET = (async (event) => {
	const method_key = event.params.method as keyof typeof OAUTH_METHODS;
	const redirect_url = await OAUTH_METHODS[method_key](event);

	redirect(302, redirect_url);
}) satisfies RequestHandler;
