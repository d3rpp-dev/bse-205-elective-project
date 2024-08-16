import { initTRPC } from "@trpc/server";
import type { Context } from "$lib/trpc/context";

export const trpcInstance = initTRPC.context<Context>().create();
