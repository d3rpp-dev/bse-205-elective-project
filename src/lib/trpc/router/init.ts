import { initTRPC } from "@trpc/server";
import type { Context } from "$lib/trpc/context";
import { ZodError } from "zod";

export const trpcInstance = initTRPC.context<Context>().create({
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
