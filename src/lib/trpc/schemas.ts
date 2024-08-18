import z from "zod";

export const USERNAME_SCHEMA = z
	.string()
	.max(32, "Usernames may be between 1 and 32 characters long.")
	.regex(
		/^[a-z0-9_]+$/,
		"Usernames may only contain lowercase letters, numbers, and underscores.",
	);

export const PASSWORD_SCHEMA = z
	.string()
	.min(8, "Password must contain at least 8 characters");
