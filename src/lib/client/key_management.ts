import type { ExportedKey, ImportedKey, ImportedKeyPair } from "./key_format";
import { keySchema } from "./key_format";

import * as devalue from "devalue";

export type KeyVariant = "public" | "private" | "imported";

// #region Read Key IDs
export const list_kids_from_localstorage = (variant: KeyVariant): string[] => {
	const prefix = `${variant}-key-`;

	const sequence = (val: number, idx: number) => val + idx;
	const is_not_null = (val: string | null) => val !== null;
	const start_with_prefix = (val: string) => val.startsWith(prefix);
	const strip_prefix = (val: string) => val.substring(prefix.length);

	// i love FP (Functional Programming)
	return new Array(window.localStorage.length)
		.fill(0)
		.map(sequence)
		.map(window.localStorage.key)
		.filter(is_not_null)
		.filter(start_with_prefix)
		.map(strip_prefix);
};

export const list_public_keys = () => list_kids_from_localstorage("public");
export const list_private_keys = () => list_kids_from_localstorage("private");
export const list_imported_keys = () => list_kids_from_localstorage("imported");
// #endregion

// #region Import Keys
export const import_single_key = async (
	variant: KeyVariant,
	kid: string,
): Promise<ImportedKey> => {
	const localstorage_key = `${variant}-key-${kid}`;

	const key_string = window.localStorage.getItem(localstorage_key);
	if (key_string === null) {
		throw new Error(`${localstorage_key} does not exist`);
	}

	const key_deserialised_result = await keySchema.safeParseAsync(
		devalue.parse(key_string),
	);

	if (!key_deserialised_result.success) {
		throw new Error(`${localstorage_key} is not a valid key`);
	} else {
		const key_data = key_deserialised_result.data;

		return {
			name: key_data.name,
			kid: key_data.kid,
			alg: key_data.alg,
			usages: key_data.usages,
			key: await window.crypto.subtle.importKey(
				"jwk",
				key_data.key,
				key_data.alg,
				true,
				key_data.usages,
			),
		};
	}
};

export const import_public_key = (kid: string): Promise<ImportedKey> =>
	import_single_key("public", kid);
export const import_private_key = (kid: string): Promise<ImportedKey> =>
	import_single_key("private", kid);
export const import_imported_key = (kid: string): Promise<ImportedKey> =>
	import_single_key("imported", kid);

export const import_key_pair = async (
	kid: string,
): Promise<ImportedKeyPair> => {
	return {
		publicKey: await import_public_key(kid),
		privateKey: await import_private_key(kid),
	};
};
// #endregion

// #region Export Keys
export const export_single_key = async (
	key: ImportedKey,
): Promise<ExportedKey> => {
	return {
		name: key.name,
		kid: key.kid,
		usages: key.usages,
		alg: key.alg,
		key: await window.crypto.subtle.exportKey("jwk", key.key),
	};
};

export const export_single_key_string = async (
	key: ImportedKey,
): Promise<string> => {
	return devalue.stringify(await export_single_key(key));
};
// #endregion

// #region Save Keys
export const save_single_key = async (
	variant: KeyVariant,
	key: ImportedKey,
): Promise<void> => {
	const localstorage_key = `${variant}-key-${key.kid}`;
	const exported_key = await export_single_key_string(key);

	window.localStorage.setItem(localstorage_key, exported_key);
};

export const save_key_pair = async ({
	publicKey,
	privateKey,
}: ImportedKeyPair): Promise<void> => {
	await save_single_key("public", publicKey);
	await save_single_key("private", privateKey);
};
export const save_imported_key = (key: ImportedKey): Promise<void> =>
	save_single_key("imported", key);
// #endregion

// #region Delete Keys
export const delete_key_variant = (variant: KeyVariant, kid: string) => {
	const localstorage_key = `${variant}-key-${kid}`;
	window.localStorage.removeItem(localstorage_key);
};

export const delete_public_key = (kid: string) =>
	delete_key_variant("public", kid);
export const delete_private_key = (kid: string) =>
	delete_key_variant("private", kid);
export const delete_imported_key = (kid: string) =>
	delete_key_variant("imported", kid);

export const delete_key = (kid: string) => {
	delete_public_key(kid);
	delete_private_key(kid);
	delete_imported_key(kid);
};
// #endregion

// #region Generate Keys
interface GenRsaKeypairParams {
	name: string;
	kid: string;
	hash: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
	modulusLength: number;
}

/**
 * Generate an RSA Key Pair
 *
 * @param kid the reserved KID
 * @returns { ImportedKeyPair }
 */
export const generate_rsa_key_pair = async ({
	hash,
	kid,
	modulusLength,
	name,
}: GenRsaKeypairParams): Promise<ImportedKeyPair> => {
	const usages: KeyUsage[] = ["wrapKey", "unwrapKey", "encrypt", "decrypt"];

	const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
		{
			name: "RSA-OAEP",
			publicExponent: new Uint8Array([1, 0, 1]),
			modulusLength,
			hash,
		},
		true,
		usages,
	);

	return {
		publicKey: {
			alg: {
				name: "RSA-OAEP",
				hash,
			},
			kid,
			name,
			usages,
			key: publicKey,
		},
		privateKey: {
			alg: {
				name: "RSA-OAEP",
				hash,
			},
			kid,
			name,
			usages,
			key: privateKey,
		},
	};
};
// #endregion
