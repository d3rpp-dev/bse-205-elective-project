/// <reference lib="dom" />

import { test, expect, describe } from "bun:test";
import {
	list_kids_from_localstorage,
	type KeyVariant,
} from "$lib/client/key_management";

const variants: KeyVariant[] = ["public", "private", "imported"];
const kids = [
	"01JCBWPCCHZXTQB0AJ0E0RAVYV",
	"01JCBWPGSCBH8TKC53YAXMT98M",
].sort();

const test_value = "<test>";

const init_localstorage = () => {
	window.localStorage.clear();

	// what?
	for (const variant in variants) {
		for (const kid of kids) {
			window.localStorage.setItem(`${variant}-key-${kid}`, test_value);
		}
	}

	expect(window.localStorage.length).toBe(variants.length * kids.length);
};

describe("key management", () => {
	test("the prefixes aren't breaking things", () => {
		init_localstorage();

		for (const variant in variants) {
			const output = list_kids_from_localstorage(
				variant as KeyVariant,
			).sort();

			expect(window.localStorage.length).toBe(
				variants.length * kids.length,
			);

			expect(output).toBeArrayOfSize(kids.length);
			expect(output).toEqual(kids);
		}
	});
});
