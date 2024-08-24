import type { RequestEvent } from "@sveltejs/kit";

import { trpcInstance } from "./init";

import { authRouter } from "./auth";
import { greeterRouter } from "./greeter";
import { userRouter } from "./user";
import { createContext } from "../context";

export const router = trpcInstance.router({
	greeter: greeterRouter,
	auth: authRouter,
	user: userRouter,
});

export type Router = typeof router;

const factory = trpcInstance.createCallerFactory(router);

export const createCaller = async (event: RequestEvent) => {
	return factory(await createContext(event));
};
