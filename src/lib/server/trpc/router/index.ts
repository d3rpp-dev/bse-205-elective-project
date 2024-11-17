import type { RequestEvent } from "@sveltejs/kit";

import { trpcInstance } from "./init";

import { createContext } from "../context";

import { greeterRouter } from "./greeter";
import { healthRouter } from "./health";
import { userRouter } from "./user";
import { keyManagementRouter } from "./key_management";
import { blobManagementRouter } from "./blob_management";

export const router = trpcInstance.router({
	greeter: greeterRouter,
	health: healthRouter,
	user: userRouter,
	keyManagement: keyManagementRouter,
	blobManagement: blobManagementRouter,
});

export type Router = typeof router;

const factory = trpcInstance.createCallerFactory(router);

export const createCaller = async (event: RequestEvent) => {
	return factory(await createContext(event));
};
