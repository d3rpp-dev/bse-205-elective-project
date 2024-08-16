import { trpcInstance } from "./init";

import { authRouter } from "./auth";
import { greeterRouter } from "./greeter";

export const router = trpcInstance.router({
	greeter: greeterRouter,
	auth: authRouter,
});

export const createCaller = trpcInstance.createCallerFactory(router);

export type Router = typeof router;
