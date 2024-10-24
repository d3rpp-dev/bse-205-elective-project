import type { RequestEvent } from "@sveltejs/kit";

import { trpcInstance } from "./init";

import { createContext } from "../context";

import { authRouter } from "./auth";
import { greeterRouter } from "./greeter";
import { healthRouter } from "./health";
import { userRouter } from "./user";
import { keyManagementRouter } from "./key_management";

export const router = trpcInstance.router({
	auth: authRouter,
	greeter: greeterRouter,
	health: healthRouter,
	user: userRouter,
	keyManagement: keyManagementRouter,
});

export type Router = typeof router;

const factory = trpcInstance.createCallerFactory(router);

export const createCaller = async (event: RequestEvent) => {
	return factory(await createContext(event));
};
