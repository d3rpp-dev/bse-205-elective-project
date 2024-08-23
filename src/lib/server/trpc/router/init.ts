import type { Context } from "$lib/server/trpc/context";

import { ZodError } from "zod";
import { initTRPC } from "@trpc/server";

// // @ts-expect-error I know the type, but it's really bloody long
// export const auth_middleware = (opts) => {
//     const user = opts.ctx.event.locals.getAuth();

//     if (!user) {
//         throw new TRPCError({
//             code: "UNAUTHORIZED"
//         });
//     } else if (user.error) {
//         throw new TRPCError({
//             code: "UNAUTHORIZED",
//             message: user.error
//         });
//     } else {
//         return opts.next({
//             ctx: {
//                 user: user as JwtPayload
//             }
//         });
//     }
// }

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
