import { GitHub } from "arctic";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "$env/static/private";

const methods = {
	github: new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET),
};

export type ValidOauthMethods = keyof typeof methods;

export const github = methods.github;
