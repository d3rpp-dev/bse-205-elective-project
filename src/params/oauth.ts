import type { ValidOauthMethods } from "$lib/server/auth/oauth_methods";
import { assert, type Equals } from "tsafe";

const valid_oauth_methods = ["github"] as const;

type OAuth2MethodNames = (typeof valid_oauth_methods)[number];

assert<Equals<ValidOauthMethods, OAuth2MethodNames>>();

export const match = (param: OAuth2MethodNames) => {
	return valid_oauth_methods.includes(param);
};
