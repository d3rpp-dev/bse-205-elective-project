import { TRPCError } from "@trpc/server";

import { trpcInstance } from "./router/init";

export const authMiddleware = trpcInstance.middleware((opts) => {
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
