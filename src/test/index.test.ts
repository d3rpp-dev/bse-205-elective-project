import { describe, expect, test } from "bun:test";

describe("Ensure Bun is Functioning", () => {
	test("Basic addition", () => {
		expect(1 + 1).toEqual(2);
	});
});