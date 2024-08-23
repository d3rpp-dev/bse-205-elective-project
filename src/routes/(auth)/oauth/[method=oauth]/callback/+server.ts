import type { RequestHandler, RequestEvent } from "./$types";

import { OAuth2RequestError } from "arctic";
import { assert, type Equals } from "tsafe";
import { and, eq } from "drizzle-orm";

import { github, type ValidOauthMethods } from "$lib/server/auth/oauth_methods";
import { lucia } from "$lib/server/auth/adapter";

import { DB } from "$lib/server/db";
import {
	userTable,
	oauthConnectionTable,
	publicAssetTable,
} from "$lib/drizzle";

/**
 * Source: https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-the-authenticated-user
 */
interface GitHubUser {
	/**
	 * OAuth2 ID
	 */
	id: number;
	/**
	 * username
	 */
	login: string;
	/**
	 * display_name
	 */
	name?: string;
	/**
	 * URL for Avatar Image
	 */
	avatar_url: string;
}

const OAUTH_CALLBACK_HANDLERS = {
	github: async (event: RequestEvent) => {
		const code = event.url.searchParams.get("code");
		const state = event.url.searchParams.get("state");
		const storedState = event.cookies.get("github_oauth_state");

		if (!code || !state || !storedState || state !== storedState) {
			console.error({
				code,
				state,
				storedState,

				state_is_eq: state === storedState,
			});

			return new Response(null, {
				status: 400,
			});
		}

		try {
			const tokens = await github.validateAuthorizationCode(code);
			const githubUserResponse = await fetch(
				"https://api.github.com/user",
				{
					headers: {
						Authorization: `Bearer ${tokens.accessToken}`,
					},
					signal: event.request.signal,
				},
			);
			const githubUser: GitHubUser = await githubUserResponse.json();

			const existing_user = await DB.select({
				user_id: oauthConnectionTable.user_id,
			})
				.from(oauthConnectionTable)
				.where(
					and(
						eq(oauthConnectionTable.type, "github"),
						eq(
							oauthConnectionTable.oauth_identifier,
							githubUser.id.toString(),
						),
					),
				);
			if (existing_user.length === 0) {
				// no user, create a new user

				// attempt to get the Avatar from GitHub
				const avatar_fetch = await fetch(githubUser.avatar_url);
				const image_type = avatar_fetch.headers.get("content-type")!;
				const image_stream = new Uint8Array(
					await avatar_fetch.arrayBuffer(),
				);

				const new_user_id = await DB.transaction(async (tx) => {
					const [{ avatar_asset_id }] = await tx
						.insert(publicAssetTable)
						.values({
							type: image_type,
							blob: image_stream,
						})
						.returning({ avatar_asset_id: publicAssetTable.id });

					const [{ new_user_id }] = await tx
						.insert(userTable)
						.values({
							username: githubUser.login,
							display_name: githubUser.name,
							profile_picture: avatar_asset_id,
						})
						.returning({ new_user_id: userTable.id });

					await tx.insert(oauthConnectionTable).values({
						type: "github",
						user_id: new_user_id,
						oauth_identifier: githubUser.id.toString(),
					});

					return new_user_id;
				});

				// new user created, now create session and log them in
				const session = await lucia.createSession(new_user_id, {});
				const session_cookie = lucia.createSessionCookie(session.id);
				event.cookies.set(session_cookie.name, session_cookie.value, {
					path: ".",
					...session_cookie.attributes,
				});
				// clear github oauth state
				event.cookies.set("github_oauth_state", "", {
					path: ".",
					expires: new Date(),
				});

				return new Response(null, {
					status: 302,
					headers: {
						Location: "/auth/sign-up/onboarding",
					},
				});
			} else {
				// user found, log them in
				const [{ user_id }] = existing_user;

				const session = await lucia.createSession(user_id, {});
				const session_cookie = lucia.createSessionCookie(session.id);
				event.cookies.set(session_cookie.name, session_cookie.value, {
					path: ".",
					...session_cookie.attributes,
				});
				// clear github oauth state
				event.cookies.set("github_oauth_state", "", {
					path: ".",
					expires: new Date(0),
				});

				return new Response(null, {
					status: 302,
					headers: {
						Location: "/app",
					},
				});
			}
		} catch (e) {
			console.error(e);

			if (e instanceof OAuth2RequestError) {
				return new Response(null, {
					status: 400,
				});
			}

			return new Response(null, {
				status: 500,
			});
		}

		return new Response(null, {
			status: 500,
		});
	},
};

assert<Equals<ValidOauthMethods, keyof typeof OAUTH_CALLBACK_HANDLERS>>();

export const GET = (async (event) => {
	const oauth_method = event.params
		.method as keyof typeof OAUTH_CALLBACK_HANDLERS;
	return await OAUTH_CALLBACK_HANDLERS[oauth_method](event);
}) satisfies RequestHandler;
