import { describe, test, expect } from "bun:test";
import { SQLiteError } from "bun:sqlite";

import { ephemeral_test_db } from "$lib/server/db";
import { userTable, passwordTable } from "$lib/drizzle";
import { ulid } from "ulid";

describe("Sign Up Functionality", () => {
	test("Password without a UserID should fail", async () => {
		const db = ephemeral_test_db();

		const test_function = async () =>
			await db
				.insert(passwordTable)
				.values({ user_id: "test_user_id", password_hash: "aaaaaa" });

		expect(test_function).toThrowError(SQLiteError);

		const password_table_rows = await db.select().from(passwordTable);

		expect(password_table_rows).toBeEmpty();
	});

	test("Password with a UserID should succeed", async () => {
		const TEST_USER_ID = ulid();
		const TEST_PASSWORD_HASH =
			"$argon2id$v=19$m=16,t=2,p=1$c2RmYWFkc2ZkZmFzZGZhc2Rm$Smi6y+dcAPZn/36OGK6tUw";

		const db = ephemeral_test_db();

		const test_promise = db.transaction(async (tx) => {
			const user = await tx
				.insert(userTable)
				.values({
					id: TEST_USER_ID,
					username: "test_user",
				})
				.returning();

			await tx.insert(passwordTable).values({
				user_id: user[0].id,
				password_hash: TEST_PASSWORD_HASH,
			});

			return user[0].id;
		});

		expect(test_promise).resolves.toBe(TEST_USER_ID);
	});
});
