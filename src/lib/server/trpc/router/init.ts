import type { Context } from "$lib/server/trpc/context";

import { transformer } from "$lib/trpc/client";

import { ZodError } from "zod";
import { initTRPC } from "@trpc/server";

export const trpcInstance = initTRPC.context<Context>().create({
	transformer,
	errorFormatter: ({ shape, error }) => {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.code === "BAD_REQUEST" &&
					error.cause instanceof ZodError
						? error.cause.flatten()
						: null,
			},
		};
	},
});
