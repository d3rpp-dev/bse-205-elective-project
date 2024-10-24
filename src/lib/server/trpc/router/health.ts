import z from "zod";
import { trpcInstance } from "./init";

export const healthRouter = trpcInstance.router({
	ping: trpcInstance.procedure
		.input(
			z.object({
				msg: z.literal("ping"),
			}),
		)
		.query(({ input }) => {
			// uncomment to test in dev mode
			// throw "";

			return {
				rx: input.msg,
				tx: "pong",
			};
		}),
});
