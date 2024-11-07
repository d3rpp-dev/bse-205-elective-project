// type imported for TSDoc, ignore this.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { page } from "$app/stores";

import type { Router } from "$lib/server/trpc/router";

import { createTRPCClient, type TRPCClientInit } from "trpc-sveltekit";
import type { QueryClient } from "@tanstack/svelte-query";
import { svelteQueryWrapper } from "trpc-svelte-query-adapter";

import { uneval } from "devalue";
import superjson from "superjson";

import { httpBatchLink } from "@trpc/client";

import { browser } from "$app/environment";

let browserClient: ReturnType<typeof svelteQueryWrapper<Router>>;

export const TRPC_PATH = `/__trpc`;

export const transformer = {
	input: superjson,
	output: {
		serialize: (object: unknown) => uneval(object),
		deserialize: (object: unknown) => eval(`(${object})`),
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
				httpBatchLink({
					url: TRPC_PATH,
					fetch: init?.fetch,
				}),
			],
		}),
		queryClient,
	});
	if (browser) browserClient = client;
	return client;
};

export type trpcClient = typeof browserClient;
