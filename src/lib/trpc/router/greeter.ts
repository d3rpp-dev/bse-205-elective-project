import z from "zod";
import { trpcInstance } from "./init";

export const greeterRouter = trpcInstance.router({
	greeting: trpcInstance.procedure
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
