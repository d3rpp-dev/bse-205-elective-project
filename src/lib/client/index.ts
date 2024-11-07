import {
	JailBirdExportedKeySchema,
	type JailBirdExportedKey,
	type JailBirdKey,
} from "./crypto_key";

export * from "./errors";
import { InvalidKeyError } from "./errors";
import { getContext, setContext } from "svelte";

const asymmentric_public_usages: KeyUsage[] = ["encrypt", "wrapKey"];

const asymmetric_private_usages: KeyUsage[] = ["decrypt", "unwrapKey"];

const asymmetric_key_usages: KeyUsage[] = [
	...asymmentric_public_usages,
	...asymmetric_private_usages,
];

const runtime_client_context_key = "$$_theAmalgamation";

export const setRuntimeClientContext = (client: TheAmalgamation) => {
	setContext(runtime_client_context_key, client);
};

export const getRuntimeClientContext = () => {
	return getContext(runtime_client_context_key) as TheAmalgamation;
};

/**
 * Behold, the amalgamation, the client that does literally everything on the client.
 */
export class TheAmalgamation {
	/**
	 * Private Keys
	 */
	private __PRIVATE_KEYS: JailBirdKey[] = [];
	/**
	 * Public Keys
	 */
	private __PUBLIC_KEYS: JailBirdKey[] = [];

	/**
	 * External Imported Key Pairs
	 */
	private __EXT_PUBLIC_KEYS: JailBirdKey[] = [];

	constructor() {}

	public initialise_from_localstorage = async () => {
		console.info("Initialising Runtime Client from Localhost");

		const stats = {
			attempts: 0,
			success: 0,
		};

		for (let i = 0; i < window.localStorage.length; i++) {
			const item_name = window.localStorage.key(i)!;
			if (item_name.startsWith("cached_key_pair-")) {
				stats.attempts++;

				const cached_key_string =
					window.localStorage.getItem(item_name)!;

				try {
					const kid = await this.import_key_string(cached_key_string);
					console.info(`Successfully key with KID ${kid}`);

					stats.success++;
				} catch (e) {
					if (e instanceof InvalidKeyError) {
						console.warn(
							`Cached key of KID ${item_name} is invalid`,
						);
					} else {
						console.error(`Failed to import KID ${item_name}`);
					}
				}
			}
		}

		console.info(
			`Attempted to import ${stats.attempts} key(s) from LocalStorage. ${stats.success} succeeded (${stats.attempts - stats.success} failed).`,
		);
	};

	private get_public_key = (kid: string): JailBirdKey | undefined => {
		return this.__PUBLIC_KEYS.find((val) => val.kid === kid);
	};

	private get_private_key = (kid: string): JailBirdKey | undefined => {
		return this.__PRIVATE_KEYS.find((val) => val.kid === kid);
	};

	public add_key_pair_to_client = async (
		kid: string,
		key_pair: CryptoKeyPair,
	) => {
		this.__PRIVATE_KEYS.push({
			kid,
			key: key_pair.privateKey,
		});

		this.__PUBLIC_KEYS.push({
			kid,
			key: key_pair.publicKey,
		});

		window.localStorage.setItem(
			`cached_key_pair-${kid}`,
			JSON.stringify(await this.encode_key_pair(key_pair)),
		);
	};

	private encode_key_pair = async (
		key: CryptoKeyPair,
	): Promise<JailBirdExportedKey["key"]> => {
		const a = {
			publicKey: await window.crypto.subtle.exportKey(
				"jwk",
				key.publicKey,
			),
			privateKey: await window.crypto.subtle.exportKey(
				"jwk",
				key.privateKey,
			),
		};

		console.debug("encoded pair", a);

		return a;
	};

	private decode_key_pair = async (
		public_key: object,
		private_key: object,
	): Promise<CryptoKeyPair> => {
		try {
			return {
				privateKey: await window.crypto.subtle.importKey(
					"jwk",
					private_key,
					{ name: "ECDSA", namedCurve: "P-521" },
					true,
					asymmetric_private_usages,
				),
				publicKey: await window.crypto.subtle.importKey(
					"jwk",
					public_key,
					{ name: "ECDSA", namedCurve: "P-521" },
					true,
					asymmentric_public_usages,
				),
			};
		} catch (e) {
			if (e instanceof TypeError || e instanceof SyntaxError) {
				// Invalid Keys
				throw new InvalidKeyError();
			} else {
				// Invalid Use of key usages
				throw new InvalidKeyError();
			}
		}
	};

	public export_key_string = async (
		kid: string,
	): Promise<string | undefined> => {
		const public_key = this.get_public_key(kid);
		const private_key = this.get_private_key(kid);
		if (!public_key || !private_key) return undefined;

		const key = {
			kid,
			key: await this.encode_key_pair({
				privateKey: private_key.key,
				publicKey: public_key.key,
			}),
		};

		console.log("export_key_string", key);

		return JSON.stringify(key);
	};

	public export_public_key = async (kid: string) => {
		const public_key = this.get_public_key(kid);
		if (!public_key) return undefined;

		return await window.crypto.subtle.exportKey("jwk", public_key.key);
	};

	/**
	 * Import a Private Key from the user to be use for cryptography
	 *
	 * @param key_string the string uploaded by the user
	 *
	 * @throws InvalidKeyError
	 */
	public import_key_string = async (key_string: string): Promise<string> => {
		try {
			const parse_result = JailBirdExportedKeySchema.safeParse(
				JSON.parse(key_string),
			);
			if (!parse_result.success) {
				throw new InvalidKeyError(parse_result.error.message);
			} else {
				const { kid, key } = parse_result.data;

				const decoded_key_pair = await this.decode_key_pair(
					key.publicKey,
					key.privateKey,
				);
				this.add_key_pair_to_client(kid, decoded_key_pair);

				return kid;
			}
		} catch (e) {
			if (e instanceof SyntaxError) {
				// invalid JSON
				throw new InvalidKeyError("Key is not valid JSON");
			} else {
				throw e;
			}
		}
	};

	/**
	 *
	 * @param kid the KID reserved from the server
	 * @param params params to be passed to generate key
	 * @returns the {@link kid}
	 */
	public generate_key_pair = async (
		kid: string,
		params: RsaHashedKeyGenParams,
	) => {
		console.info(
			`generating key ${kid} with params`,
			params,
			`and usages`,
			asymmetric_key_usages,
		);

		const key = await window.crypto.subtle.generateKey(
			params,
			true,
			asymmetric_key_usages,
		);

		this.add_key_pair_to_client(kid, key);
		return kid;
	};

	public get_private_key_count = () => {
		return this.__PRIVATE_KEYS.length;
	};

	public get_kids_of_all_private_keys = () => {
		return this.__PRIVATE_KEYS.map((k) => k.kid);
	};
}
