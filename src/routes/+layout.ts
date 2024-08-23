import { browser } from "$app/environment";
import { QueryClient } from "@tanstack/svelte-query";

import { TheAmalgamation } from "$lib/client";

import type { LayoutLoad } from "./$types";

export const load = (async () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
			},
		},
	});

    const runtimeClient = new TheAmalgamation();
    await runtimeClient.initialise_from_localstorage();

	return { queryClient, runtimeClient };
}) satisfies LayoutLoad;

export const ssr = false;
export const csr = true;
