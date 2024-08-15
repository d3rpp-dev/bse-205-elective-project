import z from "zod";

import type { Context } from "$lib/trpc/context";
import { initTRPC } from "@trpc/server";

export const t = initTRPC.context<Context>().create();

export const router = t.router({
	greeting: t.procedure
		.input(
			z.object({
				name: z.string().min(10).max(20).describe("The name to greet"),
			}),
		)
		.query(async (opts) => {
			await new Promise((res) => setTimeout(res, 1000));
			return `Hello ${opts.input.name}`;
		}),
});

export const createCaller = t.createCallerFactory(router);

export type Router = typeof router;
