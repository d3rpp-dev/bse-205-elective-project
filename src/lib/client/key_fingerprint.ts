import type { ImportedKey } from "./key_format";
import {
	export_single_key,
	get_key_jwk,
	type KeyVariant,
} from "./key_management";

import md5 from "md5";

/**
 * Note: currently only supports RSA keys.
 *
 * @param key the Imported Key to get the hash of
 */
export const generate_fingerprint = async (
	key: ImportedKey,
): Promise<string> => {
	const { key: exported } = await export_single_key(key);

	return md5(exported.n!).match(/..?/g)!.join(":");
};

/**
 * returns a fingerprint of an rsa key, otherwisre returns the string "?"
 *
 * @param variant {KeyVariant}
 * @param kid {string} the key to load
 */
export const kid_to_fingerprint = (
	variant: KeyVariant,
	kid: string,
): string => {
    try {
        const { n } = get_key_jwk(variant, kid);

        if (n == undefined) return "?";

        return md5(n).match(/..?/g)!.join(":");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
        return '?';
    }
};
