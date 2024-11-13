import type {
	ExportedKey,
	ExportedKeyPair,
	ImportedKey,
	ImportedKeyPair,
} from "./key_format";
import { keyPairSchema, keySchema } from "./key_format";

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
		.map((val) => window.localStorage.key(val))
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

export const import_key_meta = (
	variant: KeyVariant,
	kid: string,
): Omit<ImportedKey, "key" | "usages"> => {
	const localstorage_key = `${variant}-key-${kid}`;
	const key = window.localStorage.getItem(localstorage_key);

	if (!key) {
		throw new Error(`No ${variant} key with ID ${kid} found`);
	} else {
		const parsed = keySchema.safeParse(devalue.parse(key));

		if (!parsed.success) {
			throw new Error(`${variant} key with ID ${kid} is invalid`);
		} else {
			return {
				alg: parsed.data.alg,
				kid: parsed.data.kid,
				name: parsed.data.name,
			};
		}
	}
};

export const does_key_exist = (variant: KeyVariant, kid: string): boolean => {
	const localstorage_key = `${variant}-key-${kid}`;
	const key = window.localStorage.getItem(localstorage_key);

	return key !== null;
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

export const export_key_pair = async (
	kid: string,
): Promise<ExportedKeyPair> => {
	const { publicKey, privateKey } = await import_key_pair(kid);
	const [publicKeyExported, privateKeyExported] = [
		await export_single_key(publicKey),
		await export_single_key(privateKey),
	];

	return {
		publicKey: publicKeyExported,
		privateKey: privateKeyExported,
	};
};

export const export_key_pair_string = async (kid: string): Promise<string> => {
	return devalue.stringify(await export_key_pair(kid));
};

/**
 * Retrieves the exported JWK from localstorage.
 *
 * @param variant {KeyVariant} the variant of key, allows us to distinguish public and private
 * @param kid {string} KID we're fetching the JWK for
 */
export const get_key_jwk = (variant: KeyVariant, kid: string): JsonWebKey => {
	const localstorage_key = `${variant}-key-${kid}`;
	const stored = window.localStorage.getItem(localstorage_key);

	if (!stored) {
		throw new Error(`${localstorage_key} does not exist`);
	} else {
		const parsed = keySchema.safeParse(devalue.parse(stored));

		if (!parsed.success) {
			throw new Error(`${localstorage_key} is not a valid key`);
		} else {
			return parsed.data.key as JsonWebKey;
		}
	}
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

export const save_exported_key = (variant: KeyVariant, key: ExportedKey) => {
	const localstorage_key = `${variant}-${key.kid}`;
	window.localStorage.setItem(localstorage_key, devalue.stringify(key));
};
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
	const publicKeyUsages: KeyUsage[] = ["wrapKey", "encrypt"];
	const privateKeyUsages: KeyUsage[] = ["unwrapKey", "decrypt"];
	const usages: KeyUsage[] = [...publicKeyUsages, ...privateKeyUsages];

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
			usages: publicKeyUsages,
			key: publicKey,
		},
		privateKey: {
			alg: {
				name: "RSA-OAEP",
				hash,
			},
			kid,
			name,
			usages: privateKeyUsages,
			key: privateKey,
		},
	};
};
// #endregion

// #region Load Key
export const load_key_pair_from_string = (key_string: string, expected_kid?: string): string => {
	const devalued_key = devalue.parse(key_string);
	const schemad = keyPairSchema.safeParse(devalued_key);

	if (!schemad.success) {
		throw new Error(`Invalid Key`);
	}

	const key_object = schemad.data as ExportedKeyPair;

    if (expected_kid !== undefined && key_object.publicKey.kid !== expected_kid) {
        throw new Error(`Unexpeted KID, this is the wrong key`);
    }

	save_exported_key("public", key_object.publicKey);
	save_exported_key("private", key_object.privateKey);

	return key_object.publicKey.kid;
};
// #endregion
// #region Rename Keys
export const rename_key_pair = async (
	kid: string,
	new_name: string,
): Promise<string> => {
    // in and of, 2 different things
	for (const variant of ["public", "private"]) {
		try {
			const key = await import_single_key(variant as KeyVariant, kid);

			await save_single_key(variant as KeyVariant, {
                ...key,
                name: new_name
            });
		} catch (_e) {
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			_e;
		}
	}

	return new_name;
};
// #endregion
