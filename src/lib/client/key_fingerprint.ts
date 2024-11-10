import type { ImportedKey } from "./key_format";
import { export_single_key } from "./key_management";

import md5 from "md5";

export const generate_fingerprint = async (
	key: ImportedKey,
): Promise<string> => {
	const { key: exported } = await export_single_key(key);

	return md5(exported.n!).match(/..?/g)!.join(":");
};
