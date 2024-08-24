import { experimental_standaloneMiddleware, TRPCError } from "@trpc/server";

import type { Context } from "./context";

export const authMiddleware = experimental_standaloneMiddleware<{
	ctx: Context;
}>().create(async (opts) => {
	const { user, session } = opts.ctx;

	if (!user || !session) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
		});
	} else {
		return opts.next({
			ctx: {
				event: opts.ctx.event,
				user,
				session,
			},
		});
	}
});
