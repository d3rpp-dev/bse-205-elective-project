// type imported for TSDoc, ignore this.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { page } from "$app/stores";

import type { Router } from "$lib/server/trpc/router";

import { createTRPCClient, type TRPCClientInit } from "trpc-sveltekit";
import type { QueryClient } from "@tanstack/svelte-query";
import { svelteQueryWrapper } from "trpc-svelte-query-adapter";

import * as Devalue from "devalue";
import superjson from "superjson";

import { httpLink } from "@trpc/client";

import { browser } from "$app/environment";

let browserClient: ReturnType<typeof svelteQueryWrapper<Router>>;

export const TRPC_PATH = `/__trpc`;

export const transformer = {
	input: superjson,
	output: {
		serialize: Devalue.stringify,
		deserialize: Devalue.parse,
	},
	__default: true,
};

/**
 * allows access to a client-side tRPC client
 *
 * @param init it's easier to just set this to {@link page | `$page`}
 * @returns a client-side client for tRPC with this server
 */
export const trpc = (init?: TRPCClientInit, queryClient?: QueryClient) => {
	if (browser && browserClient) return browserClient;
	const client = svelteQueryWrapper({
		client: createTRPCClient<Router>({
			transformer,
			links: [
				httpLink({
					url: TRPC_PATH,
					fetch: init?.fetch,
					// headers: async ({ op }) => {
					// 	const excluded_queries = ["health.ping"];

					// 	if (excluded_queries.includes(op.path)) return {};

					// 	const client = getRuntimeClientContext();

					// 	console.log("Signing Action", op.path);

					// 	try {
					// 		const signature_header =
					// 			await client.sign_operation(op.input);
					// 		console.log({ signature_header });

					// 		return {
					// 			"X-Op-Signature": signature_header,
					// 		};
					// 	} catch (e: unknown) {
					// 		console.log("Failed to sign", e);
					// 		return {};
					// 	}
					// },
				}),
			],
		}),
		queryClient,
	});
	if (browser) browserClient = client;
	return client;
};

export type trpcClient = typeof browserClient;
