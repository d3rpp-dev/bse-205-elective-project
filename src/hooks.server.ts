import { lucia } from "$lib/server/auth/adapter";
import { authHook } from "$lib/server/auth/hook";
import { createContext } from "$lib/server/trpc/context";
import { router } from "$lib/server/trpc/router";

import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

import { createTRPCHandle } from "trpc-sveltekit";

const ONE_MINUTE_IN_MILLIS = 1000 * 60;

setInterval(() => {
	console.info("clearing sessions");
	lucia.deleteExpiredSessions();
}, ONE_MINUTE_IN_MILLIS);

export const handle: Handle = sequence(
	authHook,
	createTRPCHandle({ router, createContext }),
);
